import { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, getAdminProjects, createAdminUser, updateAdminUser, deleteAdminUser, deleteAdminProject } from '../api/admin.api';
import toast from 'react-hot-toast';
import { ShieldCheck, Plus, Trash2, Edit2, Key, Users, Briefcase, FileCode, Search, X, Loader2, Folder, Activity, BadgeCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '../../auth/store/auth.store';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', password: '', isVerified: false, isAdmin: false, badges: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (error.message.includes('401') || error.message.includes('403') || error.message.includes('denied')) {
        setAuthError('Access denied: You do not have administrator privileges.');
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
      setAuthError('Access denied: You do not have administrator privileges.');
    }
  }, [hasHydrated, user]);

  const handleDeleteUser = async (userId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-body-sm font-500 text-ink">Are you sure you want to delete this user? This will also delete all their projects and data.</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-button font-480 text-ink-muted hover:text-ink">Cancel</button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteAdminUser(userId);
                toast.success("User deleted successfully");
                fetchData();
              } catch (err) {
                toast.error(err.message || "Failed to delete user");
              }
            }} 
            className="px-3 py-1.5 bg-red-500 text-white rounded-md text-button font-480"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { minWidth: '350px' } })
  };

  const handleDeleteProject = async (projectId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-body-sm font-500 text-ink">Are you sure you want to delete this project?</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-button font-480 text-ink-muted hover:text-ink">Cancel</button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteAdminProject(projectId);
                toast.success("Project deleted successfully");
                fetchData();
              } catch (err) {
                toast.error(err.message || "Failed to delete project");
              }
            }} 
            className="px-3 py-1.5 bg-red-500 text-white rounded-md text-button font-480"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { minWidth: '300px' } })
  };

  const handleCreateUserClick = () => {
    navigate('/ary/8776/admin/users/new');
  };

  const handleEditUserClick = (user) => {
    navigate(`/ary/8776/admin/users/${user._id || user.id}`, { state: { user } });
  };

  if (!hasHydrated || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  if (authError || !user?.isAdmin) {
    return (
      <div className="flex min-h-screen w-[100wv] flex-col items-center justify-center bg-[#f7f7f5] px-6 text-black font-sans">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-12 text-center shadow-lg border border-[#e6e6e6]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#efd4d4] mb-8">
            <ShieldCheck className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-4xl font-light tracking-tighter mb-4">Access Denied.</h2>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed font-medium">
            {authError || 'Administrator privileges are required to view this dashboard.'}
          </p>
          <button onClick={() => navigate('/')} className="w-full flex justify-center items-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition-opacity hover:opacity-90">
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white font-sans text-black selection:bg-[#dceeb1]">
      <nav className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-[#e6e6e6] bg-white px-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white font-mono text-sm font-bold">
            <img  className="h-full w-full object-cover rounded-full" src="https://i.pinimg.com/736x/f9/ec/37/f9ec37d5a9ac9b18db63ea5118743767.jpg" alt="admin" />
          </div>
          <span className="font-semibold tracking-tight text-sm">Admin Console</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-[#f4ecd6] px-3 py-1 text-xs font-medium uppercase tracking-wider text-black">System Online</span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-24">
        <section className="space-y-6">
          <h1 className="text-6xl font-light tracking-tighter text-black lg:text-7xl">
            System Overview.
          </h1>
          <p className="max-w-2xl text-xl font-light leading-relaxed text-gray-600">
            Monitor users, manage projects, and oversee the entire infrastructure from a single pane of glass.
          </p>
        </section>

        <section className="overflow-hidden rounded-3xl bg-[#dceeb1] p-12 lg:p-16 relative">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-medium tracking-tight">Key Metrics</h2>
            <Activity className="h-8 w-8 text-black opacity-50" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f7f5]">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-500 font-mono">Total Users</span>
                  <span className="text-4xl font-semibold tracking-tighter mt-2">{stats?.totalUsers || users.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f7f5]">
                  <Folder className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-500 font-mono">Active Projects</span>
                  <span className="text-4xl font-semibold tracking-tighter mt-2">{stats?.totalProjects || projects.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-black p-8 text-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-400 font-mono">System Health</span>
                  <span className="text-4xl font-semibold tracking-tighter mt-2 text-[#1ea64a]">100%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-[#c5b0f4] p-12 lg:p-16">
           <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-medium tracking-tight">User Management</h2>
            <button onClick={handleCreateUserClick} className="flex items-center gap-2 rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
              <Plus className="h-4 w-4" /> Add User
            </button>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
             <div className="divide-y divide-[#e6e6e6]">
                {users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-6 transition-colors hover:bg-[#f7f7f5]">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="" className="h-12 w-12 rounded-full" />
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-semibold text-lg">{user.name || user.username}</p>
                           {user.isVerified && <BadgeCheck className="h-4 w-4 text-[#1ea64a]" />}
                           {user.isAdmin && <ShieldCheck className="h-4 w-4 text-black" />}
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.loyaltyBadges && user.loyaltyBadges.length > 0 && (
                          <div className="flex gap-2 mt-2">
                             {user.loyaltyBadges.map((badge, idx) => (
                               <span key={idx} className="rounded-full border border-[#e6e6e6] px-2 py-0.5 text-xs font-mono font-medium text-gray-500">
                                 {badge}
                               </span>
                             ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => handleEditUserClick(user)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f7f5] text-black transition-colors hover:bg-gray-200">
                          <Edit2 className="h-4 w-4" />
                       </button>
                       <button onClick={() => handleDeleteUser(user._id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efd4d4] text-red-600 transition-colors hover:bg-red-200">
                          <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <div className="p-8 text-center text-gray-500 font-mono text-sm uppercase">No users found</div>}
             </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-[#f4ecd6] p-12 lg:p-16">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-medium tracking-tight">Project Management</h2>
            <Folder className="h-8 w-8 text-black opacity-50" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {projects.map((project) => (
               <div key={project._id} className="group relative rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                 <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#c5b0f4]">
                      <Folder className="h-6 w-6 text-black" />
                    </div>
                    <button onClick={() => handleDeleteProject(project._id)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efd4d4] text-red-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-200">
                      <Trash2 className="h-4 w-4" />
                    </button>
                 </div>
                 <h3 className="font-semibold text-lg leading-tight mb-1">{project.name || 'Untitled Project'}</h3>
                 <p className="text-sm text-gray-500 line-clamp-2">{project.description || 'No description provided.'}</p>
                 <div className="mt-6 flex items-center gap-2">
                    <span className="rounded-full bg-[#f7f7f5] px-3 py-1 text-xs font-medium text-gray-600">ID: {project._id.substring(0, 8)}...</span>
                 </div>
               </div>
             ))}
             {projects.length === 0 && <div className="col-span-full p-12 text-center text-gray-500 font-mono text-sm uppercase">No projects found</div>}
          </div>
        </section>
      </main>

      <footer className="mt-24 border-t border-[#e6e6e6] bg-black px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400">Admin Console v1.0</p>
          <div className="flex gap-4">
            <div className="h-2 w-2 rounded-full bg-[#1ea64a]"></div>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-400">All Systems Nominal</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
