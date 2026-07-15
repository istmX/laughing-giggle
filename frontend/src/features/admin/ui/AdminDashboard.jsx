import { useState, useEffect, useMemo } from 'react';
import {
  getAdminStats, getAdminUsers, getAdminProjects,
  deleteAdminUser, deleteAdminProject,
} from '../api/admin.api';
import toast from 'react-hot-toast';
import {
  ShieldCheck, Plus, Trash2, Edit2, Users, Folder,
  Activity, BadgeCheck, ChevronDown, X, Search, FileCode,
  Lightbulb, Gamepad2, CheckSquare
} from 'lucide-react';
import { useAuthStore } from '../../auth/store/auth.store';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────
   Shared primitives
───────────────────────────────────────────────────────────── */
const Avatar = ({ src, seed, size = 40 }) => (
  <img
    src={src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'user')}`}
    alt=""
    className="rounded-full object-cover flex-shrink-0"
    style={{ width: size, height: size }}
  />
);

const ConfirmToast = ({ t, message, onConfirm }) => (
  <div className="flex flex-col gap-3">
    <p className="text-body-sm font-480 text-ink w-full max-w-[60ch] block">{message}</p>
    <div className="flex justify-end gap-2">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="px-3 py-1.5 text-body-sm text-ink-muted hover:text-ink transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={() => { toast.dismiss(t.id); onConfirm(); }}
        className="px-3 py-1.5 bg-red-600 text-white rounded-md text-body-sm font-480"
      >
        Delete
      </button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   AdminDashboard
───────────────────────────────────────────────────────────── */
export const AdminDashboard = () => {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [authError, setAuthError] = useState('');

  // filter / search
  const [projectSearch, setProjectSearch] = useState('');
  const [ownerFilter, setOwnerFilter]     = useState('all');
  const [userSearch, setUserSearch]       = useState('');

  /* ── fetch ── */
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, projectsData] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminProjects(),
      ]);
      setStats(statsData?.stats || statsData?.data || statsData);
      setUsers(usersData?.users || usersData?.data || usersData || []);
      setProjects(projectsData?.projects || projectsData?.data || projectsData || []);
      setAuthError('');
    } catch (error) {
      if (
        error.message.includes('401') ||
        error.message.includes('403') ||
        error.message.includes('denied')
      ) {
        setAuthError('Access denied: Administrator privileges required.');
      } else {
        toast.error('Failed to load admin data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasHydrated && isAuthenticated() && user?.isAdmin) {
      fetchData();
    } else if (hasHydrated && (!isAuthenticated() || !user?.isAdmin)) {
      setLoading(false);
      setAuthError('Access denied: Administrator privileges required.');
    }
  }, [hasHydrated, user]);

  /* ── derived lists ── */
  const filteredProjects = useMemo(() => {
    let list = projects;
    if (ownerFilter !== 'all') {
      list = list.filter(p => (p.owner?._id || p.owner?.id) === ownerFilter);
    }
    if (projectSearch.trim()) {
      const q = projectSearch.toLowerCase();
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.owner?.name || '').toLowerCase().includes(q) ||
        (p.owner?.username || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [projects, ownerFilter, projectSearch]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  /* ── unique owners for dropdown ── */
  const ownerOptions = useMemo(() => {
    const seen = new Map();
    projects.forEach(p => {
      if (p.owner) {
        const id = p.owner._id || p.owner.id;
        if (id && !seen.has(id)) seen.set(id, p.owner);
      }
    });
    return Array.from(seen.values());
  }, [projects]);

  /* ── project count per user ── */
  const projectCountByUser = useMemo(() => {
    const counts = {};
    projects.forEach(p => {
      const id = p.owner?._id || p.owner?.id;
      if (id) counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }, [projects]);

  /* ── delete actions ── */
  const handleDeleteUser = (userId) =>
    toast(
      (t) => (
        <ConfirmToast
          t={t}
          message="Delete this user? All their projects and data will be removed."
          onConfirm={async () => {
            try {
              await deleteAdminUser(userId);
              toast.success('User deleted');
              fetchData();
            } catch (err) {
              toast.error(err.message || 'Failed to delete user');
            }
          }}
        />
      ),
      { duration: Infinity, style: { minWidth: 340 } }
    );

  const handleDeleteProject = (projectId) =>
    toast(
      (t) => (
        <ConfirmToast
          t={t}
          message="Delete this project and all its data?"
          onConfirm={async () => {
            try {
              await deleteAdminProject(projectId);
              toast.success('Project deleted');
              fetchData();
            } catch (err) {
              toast.error(err.message || 'Failed to delete project');
            }
          }}
        />
      ),
      { duration: Infinity, style: { minWidth: 300 } }
    );

  /* ── loading guard ── */
  if (!hasHydrated || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-canvas">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-hairline border-t-ink" />
      </div>
    );
  }

  /* ── access guard ── */
  if (authError || !user?.isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-soft px-6">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-canvas p-12 text-center border border-hairline">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-block-pink">
            <ShieldCheck className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-4xl font-340 tracking-tight mb-4 text-ink">Access Denied.</h2>
          <p className="text-body text-ink-muted mb-10 leading-relaxed w-full max-w-[60ch] block">
            {authError || 'Administrator privileges are required.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center items-center rounded-full bg-ink px-8 py-4 text-body-sm font-480 text-canvas transition-opacity hover:opacity-90"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  /* ── main render ── */
  return (
    <div className="min-h-screen w-full bg-canvas font-sans text-ink">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-hairline bg-canvas px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-ink overflow-hidden flex items-center justify-center">
            <img
              className="h-full w-full object-cover"
              src="https://i.pinimg.com/736x/f9/ec/37/f9ec37d5a9ac9b18db63ea5118743767.jpg"
              alt="admin"
            />
          </div>
          <span className="text-body-sm font-480 tracking-tight">Admin Console</span>
        </div>
        <span className="rounded-full bg-block-cream px-3 py-1 text-caption font-mono uppercase tracking-caption">
          System Online
        </span>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-16">

        {/* ── HERO ── */}
        <section>
          <h1 className="text-6xl font-340 tracking-tight text-ink" style={{ textWrap: 'balance' }}>
            System Overview.
          </h1>
          <p className="mt-3 text-body text-ink-muted leading-relaxed w-full max-w-[60ch] block">
            Monitor users, manage projects, and oversee the platform from one place.
          </p>
        </section>

        {/* ── STATS ── */}
        <section className="overflow-hidden rounded-2xl bg-block-lime p-10">
          <h2 className="text-headline font-540 tracking-headline mb-8">Key Metrics</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Total Users',       value: stats?.totalUsers       ?? users.length,    Icon: Users       },
              { label: 'Total Projects',    value: stats?.totalProjects    ?? projects.length, Icon: Folder      },
              { label: 'Total Artifacts',   value: stats?.totalArtifacts   ?? '—',             Icon: FileCode    },
              { label: 'Total Ideas',       value: stats?.totalIdeas       ?? '—',             Icon: Lightbulb   },
              { label: 'Total Playgrounds', value: stats?.totalPlaygrounds ?? '—',             Icon: Gamepad2    },
              { label: 'Total Tasks',       value: stats?.totalTasks       ?? '—',             Icon: CheckSquare },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-xl bg-canvas border border-hairline-soft p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-soft">
                    <Icon className="h-4 w-4 text-ink" />
                  </div>
                  <span className="text-caption font-mono uppercase tracking-caption text-ink-muted">{label}</span>
                </div>
                <span className="text-5xl font-340 tracking-tight">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── USERS ── */}
        <section className="overflow-hidden rounded-2xl bg-block-lilac p-10">
          <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-headline font-540 tracking-headline">User Management</h2>
            <div className="flex items-center gap-3 flex-wrap">
              {/* search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
                <input
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search users…"
                  className="pl-9 pr-8 py-2 rounded-full bg-canvas border border-hairline text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors w-52"
                />
                {userSearch && (
                  <button
                    onClick={() => setUserSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {/* add user */}
              <button
                onClick={() => navigate('/ary/8776/admin/users/new')}
                className="flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-body-sm font-480 text-canvas hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" /> Add User
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-canvas border border-hairline-soft overflow-hidden">
            <div className="divide-y divide-hairline">
              {filteredUsers.map((u) => {
                const uid = u._id || u.id;
                const pCount = projectCountByUser[uid] || 0;
                return (
                  <div key={uid} className="flex items-center justify-between px-6 py-4 hover:bg-surface-soft transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <Avatar src={u.avatar} seed={u.username} size={44} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-body-sm font-480 text-ink w-full max-w-[60ch] block">{u.name || u.username}</p>
                          {u.isVerified && (
                            <BadgeCheck className="h-4 w-4 text-[#1ea64a] flex-shrink-0" />
                          )}
                          {u.isAdmin && (
                            <ShieldCheck className="h-4 w-4 text-ink flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-caption font-mono text-ink-muted w-full max-w-[60ch] block">{u.email}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-caption text-ink-faint font-mono">@{u.username}</span>
                          {/* clickable project count — filters the projects section */}
                          <button
                            onClick={() => {
                              setOwnerFilter(uid);
                              setProjectSearch('');
                              document.getElementById('section-projects')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-caption font-mono text-ink-muted hover:text-ink underline underline-offset-2 transition-colors"
                          >
                            {pCount} project{pCount !== 1 ? 's' : ''}
                          </button>
                        </div>
                        {u.loyaltyBadges?.length > 0 && (
                          <div className="flex gap-1.5 mt-1.5 flex-wrap">
                            {u.loyaltyBadges.map((badge, idx) => (
                              <span
                                key={idx}
                                className="rounded-full border border-hairline px-2 py-0.5 text-caption font-mono text-ink-muted"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={() => navigate(`/ary/8776/admin/users/${uid}`, { state: { user: u } })}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-soft hover:bg-hairline transition-colors"
                        title="Edit user"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-ink" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(uid)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-block-pink text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredUsers.length === 0 && (
                <div className="p-10 text-center text-body-sm font-mono text-ink-muted">
                  {userSearch ? `No users matching "${userSearch}"` : 'No users found'}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="section-projects" className="overflow-hidden rounded-2xl bg-block-cream p-10">
          <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-headline font-540 tracking-headline">Project Management</h2>
            <div className="flex items-center gap-3 flex-wrap">

              {/* owner filter */}
              <div className="relative">
                <select
                  value={ownerFilter}
                  onChange={e => setOwnerFilter(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2 rounded-full bg-canvas border border-hairline text-body-sm text-ink focus:outline-none focus:border-ink transition-colors cursor-pointer"
                >
                  <option value="all">All owners</option>
                  {ownerOptions.map(o => {
                    const oid = o._id || o.id;
                    return (
                      <option key={oid} value={oid}>
                        {o.name || o.username}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
              </div>

              {/* project search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
                <input
                  value={projectSearch}
                  onChange={e => setProjectSearch(e.target.value)}
                  placeholder="Search projects…"
                  className="pl-9 pr-8 py-2 rounded-full bg-canvas border border-hairline text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors w-52"
                />
                {projectSearch && (
                  <button
                    onClick={() => setProjectSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* clear filters */}
              {(ownerFilter !== 'all' || projectSearch) && (
                <button
                  onClick={() => { setOwnerFilter('all'); setProjectSearch(''); }}
                  className="text-body-sm text-ink-muted hover:text-ink transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* results count */}
          <p className="text-caption font-mono text-ink-muted mb-5 w-full max-w-[60ch] block">
            {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
            {ownerFilter !== 'all' && (() => {
              const o = ownerOptions.find(o => (o._id || o.id) === ownerFilter);
              return o ? ` · ${o.name || o.username}` : '';
            })()}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => {
              const owner = project.owner;
              const ownerId = owner?._id || owner?.id;
              return (
                <div
                  key={project._id}
                  className="group relative rounded-xl bg-canvas border border-hairline-soft p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
                >
                  {/* header row */}
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-block-lilac flex-shrink-0">
                      <Folder className="h-5 w-5 text-ink" />
                    </div>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-block-pink text-red-600 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all flex-shrink-0"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* title + desc */}
                  <h3 className="text-body-sm font-480 text-ink leading-tight mb-1 truncate">
                    {project.name || 'Untitled Project'}
                  </h3>
                  <p className="text-caption text-ink-muted line-clamp-2 leading-relaxed mb-4 w-full max-w-[60ch] block">
                    {project.description || 'No description.'}
                  </p>

                  {/* ── OWNER — the key missing piece ── */}
                  {owner && (
                    <button
                      onClick={() => {
                        setOwnerFilter(ownerId);
                        setProjectSearch('');
                      }}
                      className="flex items-center gap-2 w-full rounded-lg bg-surface-soft px-3 py-2 hover:bg-hairline transition-colors text-left group/owner"
                      title={`Filter by ${owner.name || owner.username}`}
                    >
                      <Avatar src={owner.avatar} seed={owner.username} size={24} />
                      <div className="min-w-0 flex-1">
                        <p className="text-caption font-480 text-ink truncate group-hover/owner:underline w-full max-w-[60ch] block">
                          {owner.name || owner.username}
                        </p>
                        <p className="text-caption text-ink-faint font-mono truncate w-full max-w-[60ch] block">
                          @{owner.username}
                        </p>
                      </div>
                    </button>
                  )}

                  {/* id tag */}
                  <div className="mt-3">
                    <span className="rounded-full bg-surface-soft px-2.5 py-1 text-caption font-mono text-ink-faint">
                      {project._id?.substring(0, 8)}…
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-16 text-center text-body-sm font-mono text-ink-muted">
                {projectSearch || ownerFilter !== 'all'
                  ? 'No projects match the current filters.'
                  : 'No projects found.'}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-hairline bg-ink px-6 py-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="font-mono text-caption uppercase tracking-caption text-white/40 w-full max-w-[60ch] block">Admin Console v1.0</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#1ea64a]" />
            <span className="font-mono text-caption uppercase tracking-caption text-white/40">All Systems Nominal</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
