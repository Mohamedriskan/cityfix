import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { User, Mail, Phone, MapPin, KeyRound, Sparkles } from 'lucide-react';

export const Profile = () => {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile({
        name,
        email,
        phone,
        address
      });
      setToastType('success');
      setToastMsg('Profile details updated successfully!');
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || 'Failed to update details.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}

      <PageHeader
        title="My Account Settings"
        subtitle="Manage your contact details and municipal filing profile."
        breadcrumbs={[{ label: 'Profile Settings', link: '/citizen/profile' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Profile Avatar Card */}
        <div className="md:col-span-4 glass-card rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3">
          <div className="relative group">
            <img
              src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Profile'}
              alt="Avatar"
              className="w-24 h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 bg-white"
            />
            <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-brand-blue flex items-center justify-center text-white border-2 border-white shadow">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-base font-bold text-slate-800 dark:text-white">
              {currentUser?.name}
            </h4>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-1">
              {currentUser?.role} Account
            </span>
          </div>
        </div>

        {/* Details Form */}
        <div className="md:col-span-8 glass-card rounded-2xl p-5 flex flex-col gap-4">
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +94 77 123 4567"
              required
            />

            <Input
              label="Filing Location Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Galle Road, Colombo"
              required
            />

            <Button
              type="submit"
              variant="gradient"
              isLoading={isUpdating}
              className="w-fit self-end mt-2"
            >
              Save Profile Changes
            </Button>
          </form>
        </div>

      </div>

    </div>
  );
};
export default Profile;
