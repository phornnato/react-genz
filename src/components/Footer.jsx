import { Code2, Heart, Github, Youtube, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Code2 size={28} />
          <span>Genz<span className="accent">Coder</span></span>
        </div>
        <p className="footer__tagline"> រៀនឥឡូវ ឈ្នះថ្ងៃស្អែក 🚀</p>

        <div className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/videos">Videos</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer__socials">
          <a href="https://github.com" target="_blank" rel="noreferrer"><Github size={20}/></a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer"><Youtube size={20}/></a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={20}/></a>
        </div>

        <p className="footer__copy">
          © {new Date().getFullYear()} GenzCoder. Made with <Heart size={14} className="accent" /> in Cambodia.
        </p>
      </div>
    </footer>
  );
}
