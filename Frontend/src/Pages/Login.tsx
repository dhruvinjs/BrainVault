import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation, useGoogleLoginMutation } from '../hooks/useAuthQueries';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

export function Login() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // --- Normal login mutation ---
  const { mutate: login, isPending: isLoggingIn, error } = useLoginMutation();

  // --- Google login mutation ---
  const { mutateAsync: googleLogin } = useGoogleLoginMutation();

  // --- Handle normal username/password login ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    if (!username || !password) return;

    login({ username, password }, {
      onSuccess: () => {
        toast.success("Login successful!");
        navigate('/dashboard', { replace: true });
      },
      onError: (err: AxiosError<any>) => {
        const msg = err.response?.data?.message || "Login failed";
        toast.error(msg);
      }
    });
  };

  // --- Handle Google login success ---
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential; // ID token from Google
      if (!token) return toast.error("Google login failed");

      await googleLogin(token); // call your /auth/google/login endpoint
      toast.success("Google login successful!");
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In failed");
  };

  // --- Get error message for normal login ---
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof AxiosError && err.response?.data?.message) {
      return err.response.data.message;
    }
    return 'Invalid username or password';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-8">
          <ArrowLeft size={20} />
          <span>Back to home</span>
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome Back</h1>
            <p className="text-slate-600 dark:text-slate-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  ref={usernameRef}
                  type="text"
                  placeholder="your_username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm text-center">
                {getErrorMessage(error)}
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoggingIn}
              className="w-full bg-slate-800 dark:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>

          <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
