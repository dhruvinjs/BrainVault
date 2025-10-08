import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Lock, ArrowLeft, Chrome, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLoginMutation, useGoogleLoginMutation } from '../store/useAuthStore';
import { AxiosError } from 'axios';

export function Login() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false); // <-- new state

  const { 
    mutate: login, 
    isPending: isLoggingIn, 
    error 
  } = useLoginMutation();

  const { 
    mutate: googleLogin, 
    isPending: isGoogleLoggingIn 
  } = useGoogleLoginMutation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    if (!username || !password) return;

    login({ username, password });
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  const isLoading = isLoggingIn || isGoogleLoggingIn;

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof AxiosError && err.response?.data?.message) {
      return err.response.data.message;
    }
    return 'Invalid username or password';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center px-6 py-12">
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

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to access your BrainVault
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  ref={usernameRef}
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-colors"
                  placeholder="your_username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'} // <-- toggle
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-colors"
                  placeholder="••••••••"
                  required
                />
                {/* Toggle icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm text-center">
                {getErrorMessage(error)}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-800 dark:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
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
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-3 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome size={20} />
            {isGoogleLoggingIn ? 'Redirecting...' : 'Sign in with Google'}
          </motion.button>

          <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
