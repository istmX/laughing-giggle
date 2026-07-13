import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createAdminUser, updateAdminUser, getAdminUsers } from '../api/admin.api';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function AdminUserForm() {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = Boolean(userId);
  
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', isVerified: false, isAdmin: false, badges: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      if (location.state?.user) {
        populateForm(location.state.user);
        setIsLoading(false);
      } else {
        getAdminUsers().then((res) => {
          const user = (res.users || []).find(u => u._id === userId || u.id === userId);
          if (user) populateForm(user);
          else toast.error('User not found');
        }).catch(() => toast.error('Failed to load user'))
          .finally(() => setIsLoading(false));
      }
    }
  }, [isEdit, userId, location.state]);

  const populateForm = (u) => {
    setFormData({
      name: u.name || '',
      email: u.email || '',
      password: '',
      isVerified: !!u.isVerified,
      isAdmin: !!u.isAdmin,
      badges: (u.loyaltyBadges || []).join(', ')
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        isVerified: formData.isVerified,
        isAdmin: formData.isAdmin,
        loyaltyBadges: formData.badges.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (formData.password) payload.password = formData.password;

      if (isEdit) {
        await updateAdminUser(userId, payload);
        toast.success('User updated successfully');
      } else {
        await createAdminUser(payload);
        toast.success('User created successfully');
      }
      navigate('/ary/8776/admin');
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f7f7f5]">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-6 py-12 md:px-12 font-sans text-black overflow-y-auto">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => navigate('/ary/8776/admin')} className="mb-10 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="mb-12 text-6xl md:text-7xl font-light tracking-tighter">
          {isEdit ? 'Edit User.' : 'New User.'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
           <div className={`p-8 md:p-12 rounded-[32px] ${isEdit ? 'bg-[#c5b0f4]' : 'bg-[#dceeb1]'} space-y-8`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-black/70">Full Name</label>
                   <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-2xl border-none bg-white px-5 py-5 text-lg text-black focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow" placeholder="Jane Doe" />
                </div>
                <div>
                   <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-black/70">Email Address</label>
                   <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-2xl border-none bg-white px-5 py-5 text-lg text-black focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow" placeholder="jane@example.com" />
                </div>
              </div>
              <div>
                 <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-black/70">Password {isEdit && <span className="normal-case tracking-normal font-normal opacity-75">(Leave blank to keep current)</span>}</label>
                 <input type="password" required={!isEdit} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full rounded-2xl border-none bg-white px-5 py-5 text-lg text-black focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow" placeholder="••••••••" />
              </div>
           </div>
           
           {isEdit && (
             <>
               <div className="p-8 md:p-12 rounded-[32px] bg-[#c8e6cd] space-y-6">
                  <div>
                     <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-black/70">Loyalty Badges</label>
                     <input type="text" value={formData.badges} onChange={(e) => setFormData({...formData, badges: e.target.value})} placeholder="e.g. Early Adopter, Top Creator (comma separated)" className="w-full rounded-2xl border-none bg-white px-5 py-5 text-lg text-black focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow font-mono text-sm" />
                  </div>
               </div>

               <div className="p-8 md:p-12 rounded-[32px] bg-[#f4ecd6]">
                  <label className="block text-sm font-bold uppercase tracking-widest mb-6 text-black/70">Permissions & Flags</label>
                  <div className="flex flex-col sm:flex-row gap-6">
                     <label className="flex flex-1 items-center gap-5 cursor-pointer rounded-2xl bg-white/50 p-6 transition-colors hover:bg-white/80">
                        <Checkbox checked={formData.isVerified} onCheckedChange={(checked) => setFormData({...formData, isVerified: checked})} className="h-7 w-7 rounded-md border-2 border-black/20 data-[state=checked]:bg-black data-[state=checked]:border-black" />
                        <span className="text-xl font-medium text-black">Verified User</span>
                     </label>
                     <label className="flex flex-1 items-center gap-5 cursor-pointer rounded-2xl bg-white/50 p-6 transition-colors hover:bg-white/80">
                        <Checkbox checked={formData.isAdmin} onCheckedChange={(checked) => setFormData({...formData, isAdmin: checked})} className="h-7 w-7 rounded-md border-2 border-black/20 data-[state=checked]:bg-black data-[state=checked]:border-black" />
                        <span className="text-xl font-medium text-black">Administrator</span>
                     </label>
                  </div>
               </div>
             </>
           )}

           <div className="pt-8 flex flex-col sm:flex-row gap-6">
              <button type="button" onClick={() => navigate('/ary/8776/admin')} className="flex-1 rounded-full bg-white px-8 py-5 text-xl font-medium text-black transition-opacity hover:opacity-70 shadow-sm border border-[#e6e6e6]">
                 Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center rounded-full bg-black px-8 py-5 text-xl font-medium text-white transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100">
                 {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Save Changes'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
