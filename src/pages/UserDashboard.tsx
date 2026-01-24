import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Github,
  Mail,
  MapPin,
  Users,
  BookOpen,
  ArrowRight,
  LogOut,
  Bookmark,
} from "lucide-react";
import Modal from "../components/Modal";

interface UserData {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  company: string;
  location: string;
  email: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/auth/user", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        } else {
          navigate("/login");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching user data",
        );
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "DELETE",
        credentials: "include",
      });
      // Full page reload to refresh Navbar's user state
      setShowLogoutConfirm(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex-grow py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">
              Error: {error || "User not found"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            User Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Welcome back, {user.name || user.login}!
          </p>
        </div>

        {/* Profile Card */}
        <div className="mb-12">
          <div className="glass-card border border-gray-700/50 p-8 rounded-lg">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-32 h-32 rounded-full border-4 border-blue-500/50 object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex-grow">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {user.name || user.login}
                </h2>
                <p className="text-gray-400 mb-6">@{user.login}</p>

                {user.bio && (
                  <p className="text-gray-300 mb-6 max-w-2xl">{user.bio}</p>
                )}

                {/* User Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {user.location && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{user.location}</span>
                    </div>
                  )}

                  {user.company && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Github className="w-4 h-4 text-blue-400" />
                      <span>{user.company}</span>
                    </div>
                  )}

                  {user.email && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}

                  {user.created_at && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span>
                        Joined{" "}
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`https://github.com/${user.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    View GitHub Profile
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-red-400 font-medium transition-colors border border-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Repositories */}
            <div className="glass-card border border-gray-700/50 p-6 rounded-lg hover:bg-gray-800/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    Public Repositories
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {user.public_repos}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Github className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p className="text-gray-500 text-xs">Total public repositories</p>
            </div>

            {/* Followers */}
            <div className="glass-card border border-gray-700/50 p-6 rounded-lg hover:bg-gray-800/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Followers</p>
                  <p className="text-3xl font-bold text-white">
                    {user.followers}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-gray-500 text-xs">People following you</p>
            </div>

            {/* Following */}
            <div className="glass-card border border-gray-700/50 p-6 rounded-lg hover:bg-gray-800/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Following</p>
                  <p className="text-3xl font-bold text-white">
                    {user.following}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-gray-500 text-xs">People you follow</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate("/issues")}
              className="group glass-card border border-gray-700/50 p-6 rounded-lg hover:bg-gray-800/50 hover:border-blue-500/50 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    Find Issues
                  </h4>
                  <p className="text-gray-400 text-sm mt-2">
                    Discover open-source issues
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </div>
            </button>

            <button
              onClick={() => navigate("/bookmarks")}
              className="group glass-card border border-gray-700/50 p-6 rounded-lg hover:bg-gray-800/50 hover:border-blue-500/50 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    My Bookmarks
                  </h4>
                  <p className="text-gray-400 text-sm mt-2">
                    View your saved issues
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </div>
            </button>

            <button
              onClick={() => navigate("/")}
              className="group glass-card border border-gray-700/50 p-6 rounded-lg hover:bg-gray-800/50 hover:border-blue-500/50 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    Back to Home
                  </h4>
                  <p className="text-gray-400 text-sm mt-2">
                    Return to the main landing page
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </div>
            </button>
          </div>
        </div>
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
    </div>
  );
}
