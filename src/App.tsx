import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-white selection:bg-primary selection:text-white">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
