import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useLogoutMutation } from '../store/useAuthStore';

export function Header() {
  const { isAuthenticated } = useAuthStore();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/login');
      }
    });
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-500">
          Brain Vault
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link></li>
                <li>
                  <button 
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="text-gray-300 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors duration-300">Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
