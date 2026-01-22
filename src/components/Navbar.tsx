import { Github, Code2 } from 'lucide-react';

function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span>ContributionHub</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 hover:text-white transition-all text-sm font-medium border border-white/10">
            <Github className="w-4 h-4" />
            <span>Sign in with GitHub</span>
          </button>
        </div>
    </header>
  )
}

export default Navbar