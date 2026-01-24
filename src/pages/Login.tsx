import { Github, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="glass-card p-6 sm:p-8 md:p-12">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-3 leading-tight">
              <span className="gradient-text">ContributionHub</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">
              Find and contribute to open source projects
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/github`;
              }}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:from-blue-500 active:to-purple-500 text-white font-bold text-base sm:text-lg transition-all shadow-lg shadow-blue-500/20 group"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              Sign in with GitHub
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
