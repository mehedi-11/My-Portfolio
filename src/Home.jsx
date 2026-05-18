import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import BlogPreview from './components/BlogPreview';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';

const Home = () => {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <BlogPreview />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Home;
