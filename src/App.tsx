import React from 'react';
import { Github, Code2, Cpu, TrendingUp, ArrowRight } from 'lucide-react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-white selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        {/* Hero Section */}
        

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
