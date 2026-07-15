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
      <div className="flex min-h-screen w-full items-center justify-center bg-surface-soft">
        <Loader2 className="h-10 w-10 animate-spin text-ink" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft px-6 py-12 md:px-12 font-sans text-ink overflow-y-auto">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => navigate('/ary/8776/admin')} className="mb-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-canvas hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="mb-12 text-display-lg tracking-display-lg text-ink">
          {isEdit ? 'Edit User.' : 'New User.'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
           <div className={`p-8 md:p-12 rounded-xl ${isEdit ? 'bg-block-lilac' : 'bg-block-lime'} space-y-8`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <label className="block text-eyebrow tracking-eyebrow mb-3 text-ink">Full Name</label>
                   <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-md border border-hairline bg-canvas px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors" placeholder="Jane Doe" />
                </div>
                <div>
                   <label className="block text-eyebrow tracking-eyebrow mb-3 text-ink">Email Address</label>
                   <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-md border border-hairline bg-canvas px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors" placeholder="jane@example.com" />
                </div>
              </div>
              <div>
                 <label className="block text-eyebrow tracking-eyebrow mb-3 text-ink">Password {isEdit && <span className="normal-case tracking-normal font-mono text-caption opacity-75">(Leave blank to keep current)</span>}</label>
                 <input type="password" required={!isEdit} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full rounded-md border border-hairline bg-canvas px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors" placeholder="••••••••" />
              </div>
           </div>
           
           {isEdit && (
             <>
               <div className="p-8 md:p-12 rounded-xl bg-block-mint space-y-6">
                  <div>
                     <label className="block text-eyebrow tracking-eyebrow mb-3 text-ink">Loyalty Badges</label>
                     <input type="text" value={formData.badges} onChange={(e) => setFormData({...formData, badges: e.target.value})} placeholder="e.g. Early Adopter, Top Creator (comma separated)" className="w-full rounded-md border border-hairline bg-canvas px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors font-mono text-sm" />
                  </div>
               </div>

               <div className="p-8 md:p-12 rounded-xl bg-block-cream">
                  <label className="block text-eyebrow tracking-eyebrow mb-6 text-ink">Permissions & Flags</label>
                  <div className="flex flex-col sm:flex-row gap-6">
                     <label className="flex flex-1 items-center gap-5 cursor-pointer rounded-lg bg-canvas/50 p-6 transition-colors hover:bg-canvas/80">
                        <Checkbox checked={formData.isVerified} onCheckedChange={(checked) => setFormData({...formData, isVerified: checked})} className="h-6 w-6 rounded border border-hairline data-[state=checked]:bg-ink data-[state=checked]:border-ink" />
                        <span className="text-body font-480 text-ink">Verified User</span>
                     </label>
                     <label className="flex flex-1 items-center gap-5 cursor-pointer rounded-lg bg-canvas/50 p-6 transition-colors hover:bg-canvas/80">
                        <Checkbox checked={formData.isAdmin} onCheckedChange={(checked) => setFormData({...formData, isAdmin: checked})} className="h-6 w-6 rounded border border-hairline data-[state=checked]:bg-ink data-[state=checked]:border-ink" />
                        <span className="text-body font-480 text-ink">Administrator</span>
                     </label>
                  </div>
               </div>
             </>
           )}

           <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <button type="button" onClick={() => navigate('/ary/8776/admin')} className="flex-1 rounded-pill bg-canvas px-6 py-3 text-button font-480 text-ink transition-opacity hover:opacity-70 border border-hairline">
                 Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center rounded-pill bg-ink px-6 py-3 text-button font-480 text-canvas transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100">
                 {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Changes'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
