import { Github, Code2, CloudCog } from "lucide-react";
import useScreenWidth from "../hooks/useScreenWidth";

function Navbar() {
  const screenWidth = useScreenWidth();

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span>ContributionHub</span>
        </div>
        <button className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-gray-800 sm:hover:bg-gray-700 active:bg-gray-700 hover:text-white transition-all text-sm font-medium border border-white/10">
          <Github className="max-w-4 max-h-4" />
          {screenWidth < 530 ? (
            <span>Sign in</span>
          ) : (
            <span>Sign in with GitHub</span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
