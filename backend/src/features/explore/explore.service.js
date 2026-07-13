import User from '../auth/auth.model.js';

// In-memory Trie Node for fast prefix search
class TrieNode {
  constructor() {
    this.children = new Map(); // HashMap for children
    this.users = new Set();    // Store user IDs that match this prefix
  }
}

class UserSearchIndex {
  constructor() {
    this.root = new TrieNode();
    this.userCache = new Map(); // HashMap mapping user ID to User object
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    const users = await User.find({ isPublic: true }).select('-password -email -googleId -provider');
    for (const user of users) {
      this.addUser(user);
    }
    this.isInitialized = true;
  }

  addUser(user) {
    this.userCache.set(user._id.toString(), user);
    
    // Index by words in name and username
    const terms = [];
    if (user.name) terms.push(...user.name.toLowerCase().split(/\s+/));
    if (user.username) terms.push(user.username.toLowerCase());

    for (const term of terms) {
      if (!term) continue;
      let current = this.root;
      for (let i = 0; i < term.length; i++) {
        const char = term[i];
        if (!current.children.has(char)) {
          current.children.set(char, new TrieNode());
        }
        current = current.children.get(char);
        current.users.add(user._id.toString());
      }
    }
  }

  search(query, page, limit) {
    if (!query) return { users: [], total: 0, page, totalPages: 0 };
    const term = query.toLowerCase().trim();
    let current = this.root;
    
    // Exact prefix match
    for (let i = 0; i < term.length; i++) {
      const char = term[i];
      if (!current.children.has(char)) {
        return { users: [], total: 0, page, totalPages: 0 }; // Not found
      }
      current = current.children.get(char);
    }

    const matchedIds = Array.from(current.users);
    const total = matchedIds.length;
    const skip = (page - 1) * limit;
    
    const paginatedIds = matchedIds.slice(skip, skip + limit);
    const users = paginatedIds.map(id => this.userCache.get(id)).filter(Boolean);
    
    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}

const searchIndex = new UserSearchIndex();

export const exploreService = {
  async getPublicUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find({ isPublic: true })
      .select('-password -email -googleId -provider')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments({ isPublic: true });
    
    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  async searchUsers(query, page = 1, limit = 10) {
    // Ensure index is loaded
    await searchIndex.initialize();
    
    // Fallback to MongoDB regex if the index doesn't have it (or to be safe)
    // But we will use the fast Trie search directly:
    return searchIndex.search(query, page, limit);
  },

  async getTopUsers() {
    // For now, sorting by createdAt to simulate top users
    const users = await User.find({ isPublic: true })
      .select('-password -email -googleId -provider')
      .sort({ createdAt: 1 })
      .limit(10);
      
    return users;
  }
};
