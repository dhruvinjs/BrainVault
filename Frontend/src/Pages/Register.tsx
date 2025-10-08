import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { User, Lock, ArrowLeft, X, Mail, Chrome, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useRegisterMutation } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

const userSchema = z.object({
  username: z.string().min(3, 'Username should be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain a special character')
});

const passwordRequirements = [
  { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
  { label: 'Contains uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
  { label: 'Contains special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
];

export function Register() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync: registerUser, isPending } = useRegisterMutation();

  const showError = (field: string, message: string) => {
    const errorElement = document.getElementById(`error-${field}`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }
  };

  const clearErrors = () => {
    const errorElements = document.querySelectorAll('[id^="error-"]');
    errorElements.forEach(el => {
      el.textContent = '';
      el.classList.add('hidden');
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const formData = {
      username: usernameRef.current?.value || '',
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
      confirmPassword: confirmPasswordRef.current?.value || ''
    };

    if (formData.password !== formData.confirmPassword) {
      showError('confirmPassword', 'Passwords do not match');
      return;
    }

    const result = userSchema.safeParse(formData);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          showError(err.path[0] as string, err.message);
        }
      });
      return;
    }

    try {
      if (submitButtonRef.current) submitButtonRef.current.disabled = true;

      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success(response.message || 'Account created successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      if (submitButtonRef.current) submitButtonRef.current.disabled = false;
    }
  };

  const handleGoogleRegister = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
      setTimeout(() => {
        if (submitButtonRef.current) submitButtonRef.current.disabled = false;
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to home</span>
        </Link>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Create Account</h1>
            <p className="text-slate-600 dark:text-slate-400">Start your journey with BrainVault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  ref={usernameRef}
                  name="username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-colors"
                  placeholder="johndoe"
                />
              </div>
              <p id="error-username" className="hidden text-red-500 text-sm mt-1 flex items-center gap-1">
                <X size={14} />
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  ref={emailRef}
                  name="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <p id="error-email" className="hidden text-red-500 text-sm mt-1 flex items-center gap-1">
                <X size={14} />
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  ref={passwordRef}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onInput={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    passwordRequirements.forEach((req, index) => {
                      const icon = document.getElementById(`req-icon-${index}`);
                      const label = document.getElementById(`req-label-${index}`);
                      const passed = req.test(value);
                      if (icon && label) {
                        icon.innerHTML = passed
                          ? `<svg xmlns="http://www.w3.org/2000/svg" class="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
                          : `<svg xmlns="http://www.w3.org/2000/svg" class="text-slate-400 dark:text-slate-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
                        label.className = passed
                          ? 'text-green-600 dark:text-green-400 transition-colors'
                          : 'text-slate-500 dark:text-slate-400 transition-colors';
                      }
                    });
                  }}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div id={`req-icon-${index}`} className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-slate-400 dark:text-slate-500"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <span id={`req-label-${index}`} className="text-slate-500 dark:text-slate-400 transition-colors">
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              <p id="error-password" className="hidden text-red-500 text-sm mt-2 flex items-center gap-1">
                <X size={14} />
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  ref={confirmPasswordRef}
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p id="error-confirmPassword" className="hidden text-red-500 text-sm mt-1 flex items-center gap-1">
                <X size={14} />
              </p>
            </div>

            {/* Submit */}
            <motion.button
              ref={submitButtonRef}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-800 dark:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleRegister}
            type="button"
            className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-3 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome size={20} />
            Sign up with Google
          </motion.button>

          <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
