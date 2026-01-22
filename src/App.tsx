import React from 'react';
import { Github, Code2, Cpu, TrendingUp, ArrowRight } from 'lucide-react';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-white selection:bg-primary selection:text-white">
      {/* Header */}
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

      <main className="flex-grow pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Now indexing 50,000+ open source issues
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Stop Searching. <br />
              <span className="gradient-text">Start Contributing.</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The first open-source matchmaker that scans your GitHub profile to find 
              issues tailored to your specific tech stack and experience level.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group">
                Find My First Issue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-200 font-medium text-lg border border-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2">
                <Github className="w-5 h-5" />
                View on GitHub
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card p-8 hover:bg-dark-800 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Stack Analysis</h3>
              <p className="text-gray-400 leading-relaxed">
                We analyze your recent commits and languages to create a unique "Developer Fingerprint" that matches you with relevant repositories.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 hover:bg-dark-800 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Code2 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Matching</h3>
              <p className="text-gray-400 leading-relaxed">
                Filter out the noise. Our algorithm scores issues based on complexity and your history, so you never feel overwhelmed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 hover:bg-dark-800 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Career Growth</h3>
              <p className="text-gray-400 leading-relaxed">
                Build a portfolio that stands out. Consistent contributions to major projects are the best way to prove your skills.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
