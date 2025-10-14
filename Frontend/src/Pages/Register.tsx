import { GoogleLogin } from '@react-oauth/google';
import { useGoogleRegisterMutation,useRegisterMutation } from "../hooks/useAuthQueries";
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { User, Lock, ArrowLeft, X, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import toast from 'react-hot-toast';
const userSchema = z.object({
  username: z.string().min(3, 'Username should be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain a special character'),
});

const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
  { id: 'uppercase', label: 'Contains uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
  { id: 'special', label: 'Contains special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

export function Register() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { mutateAsync: registerUser } = useRegisterMutation();
  // const navigate=useNavigate()
  const { mutateAsync: googleRegister } = useGoogleRegisterMutation();
  const updatePasswordRequirements = () => {
    const password = passwordRef.current?.value || '';

    passwordRequirements.forEach((req) => {
      const icon = document.getElementById(`req-icon-${req.id}`);
      const label = document.getElementById(`req-label-${req.id}`);
      const isValid = req.test(password);

      if (icon && label) {
        if (password.length === 0) {
          icon.innerHTML = '<div class="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>';
          label.className = 'text-slate-500 dark:text-slate-400';
        } else if (isValid) {
          icon.innerHTML = `<svg class="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
          label.className = 'text-green-600 dark:text-green-400 font-medium';
        } else {
          icon.innerHTML = `<svg class="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
          label.className = 'text-red-600 dark:text-red-400';
        }
      }
    });
  };

  const showError = (field: string, message: string) => {
    const errorElement = document.getElementById(`error-${field}`);
    if (errorElement) {
      const textSpan = errorElement.querySelector('span');
      if (textSpan) textSpan.textContent = message;
      errorElement.classList.remove('hidden');
      errorElement.classList.add('flex');
    }
  };

  const clearErrors = () => {
    const errorElements = document.querySelectorAll('[id^="error-"]');
    errorElements.forEach((el) => {
      const textSpan = el.querySelector('span');
      if (textSpan) textSpan.textContent = '';
      el.classList.add('hidden');
      el.classList.remove('flex');
    });
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const formData = {
      username: usernameRef.current?.value || '',
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
      confirmPassword: confirmPasswordRef.current?.value || '',
    };

    if (formData.password !== formData.confirmPassword) {
      showError('confirmPassword', 'Passwords do not match');
      return;
    }

    const result = userSchema.safeParse(formData);
    if (!result.success) {
      result.error.issues.forEach((err) => {
        if (err.path[0]) showError(err.path[0] as string, err.message);
      });
      return;
    }

    if (submitButtonRef.current) submitButtonRef.current.disabled = true;

    await registerUser({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (submitButtonRef.current) submitButtonRef.current.disabled = false;
  };


// const handleGoogleRegister = useGoogleLogin({
//   onSuccess: async (tokenResponse) => {
//     try {
//       const accessToken = tokenResponse.access_token;

//       if (!accessToken) {
//         toast.error("Failed to get Google token");
//         return;
//       }

//     await googleRegister(accessToken)
//     } catch (err) {
//       console.error(err);
//       toast.error("Google registration failed");
//     }
//   },
//   onError: () => {
//     toast.error("Google Sign-In failed");
//   },
// });

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
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  ref={usernameRef}
                  name="username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-colors"
                  placeholder="johndoe"
                />
              </div>
              <p id="error-username" className="hidden text-red-500 text-sm mt-1 items-center gap-1">
                <X size={14} />
                <span></span>
              </p>
            </div>

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
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <p id="error-email" className="hidden text-red-500 text-sm mt-1 items-center gap-1">
                <X size={14} />
                <span></span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  ref={passwordRef}
                  name="password"
                  type="password"
                  onInput={updatePasswordRequirements}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div className="mt-3 space-y-2">
                {passwordRequirements.map((req) => (
                  <div key={req.id} className="flex items-center gap-2 text-sm">
                    <div id={`req-icon-${req.id}`} className="flex-shrink-0">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <span id={`req-label-${req.id}`} className="text-slate-500 dark:text-slate-400">
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              <p id="error-password" className="hidden text-red-500 text-sm mt-2 items-center gap-1">
                <X size={14} />
                <span></span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  ref={confirmPasswordRef}
                  name="confirmPassword"
                  type="password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <p id="error-confirmPassword" className="hidden text-red-500 text-sm mt-1 items-center gap-1">
                <X size={14} />
                <span></span>
              </p>
            </div>

            <motion.button
              ref={submitButtonRef}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-slate-800 dark:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
              <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const idToken = credentialResponse.credential; // ✅ This is the JWT (ID Token)
                    if (!idToken) {
                      toast.error("Failed to get Google ID token");
                      return;
                    }

                    // Send to your backend via react-query mutation
                    await googleRegister(idToken);
                  } catch (err) {
                    console.error(err);
                    toast.error("Google registration failed");
                  }
                }}
                onError={() => {
                  toast.error("Google Sign-In failed");
                }}
              />
            </div>


          <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
