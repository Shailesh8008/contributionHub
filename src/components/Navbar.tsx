import { Github, Code2, LogOut, Bookmark, LayoutDashboard } from "lucide-react";
import useScreenWidth from "../hooks/useScreenWidth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "./Modal";

function Navbar() {
  const screenWidth = useScreenWidth();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      });
  }, []);

  const handleLogout = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        setUser(null);
        setShowDropdown(false);
        navigate("/");
      })
      .catch((err) => {
        throw new Error(err);
      });
    setShowLogoutConfirm(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to={"/"}
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span>ContributionHub</span>
        </Link>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-blue-500/50 hover:border-blue-500 transition-all"
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-full h-full object-cover"
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user.login}</p>
                  <p className="text-xs text-gray-400">
                    {user.email.length <= 24
                      ? user.email
                      : user.email.slice(0, 24) + "..."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2 border-b border-white/5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/bookmarks");
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2 border-b border-white/5"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmarks</span>
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-800 sm:hover:bg-gray-700 active:bg-gray-700 hover:text-white transition-all text-sm font-medium border border-white/10"
          >
            <Github className="max-w-4 max-h-4" />
            {screenWidth < 530 ? (
              <span>Sign in</span>
            ) : (
              <span>Sign in with GitHub</span>
            )}
          </button>
        )}
      </div>
      <Modal isOpen={showLogoutConfirm}>
        <h2 className="text-2xl font-bold text-white mb-4">Confirm Logout</h2>
        <p className="text-gray-400 mb-8">
          Are you sure you want to logout? You'll need to sign in again with
          GitHub.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowLogoutConfirm(false)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors border border-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </Modal>
    </header>
  );
}

export default Navbar;
