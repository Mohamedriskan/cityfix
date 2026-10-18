import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Checkbox } from '../components/common/Checkbox';
import { Toast } from '../components/common/Toast';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required.';
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?\d{9,12}$/.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (e.g. +94771234567).';
    }

    if (!address.trim()) newErrors.address = 'Residential Address is required.';

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({
        fullName,
        email,
        phone,
        address,
        password
      });

      setToastType('success');
      setToastMessage('Account created successfully! Logging you in...');
      setTimeout(() => {
        navigate('/citizen/dashboard');
      }, 1000);
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-6 text-left">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}

      {/* Ambient background glows */}
      <div className="absolute w-72 h-72 rounded-full bg-brand-blue/10 blur-3xl -z-10 -translate-x-12 -translate-y-12 animate-pulse" />
      <div className="absolute w-72 h-72 rounded-full bg-brand-purple/10 blur-3xl -z-10 translate-x-12 translate-y-12" />

      {/* Glass card container */}
      <div className="w-full max-w-lg glass-card rounded-3xl p-8 border border-white/40 dark:border-slate-800/40 shadow-2xl relative overflow-hidden flex flex-col gap-6">
        
        {/* Logo */}
        <div className="flex justify-center select-none">
          <img 
            src="/Cityfix.jpeg" 
            alt="CityFix Logo" 
            className="w-16 h-16 rounded-2xl object-cover shadow-md" 
          />
        </div>

        <div className="text-center flex flex-col gap-2 select-none">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Register Citizen Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Become a part of the smart city community and file reports instantly.
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              placeholder="e.g. Ruwan Perera"
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="ruwan@example.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              placeholder="e.g. +94 77 123 4567"
              required
            />
            <Input
              label="Residential Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={errors.address}
              placeholder="Colombo Road, Colombo"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mt-2">
            <Checkbox
              label="I agree to the Terms of Service & Privacy policy rules of the Colombo Municipality"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              error={errors.agreeTerms}
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            isLoading={isLoading}
            className="w-full mt-4"
          >
            Create Account
          </Button>
        </form>

        <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-semibold mt-2 select-none">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-blue dark:text-brand-purple hover:underline font-extrabold">
            Sign In here
          </Link>
        </p>

      </div>
    </div>
  );
};
export default Register;
