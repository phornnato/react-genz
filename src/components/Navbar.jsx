import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Zap } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/tools', label: 'Tools' },
  { to: '/videos', label: 'Videos' },
  { to: '/courses', label: 'Courses' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-icon"><Code2 size={22} /></span>
          <span className="navbar__brand-text">Genz<span className="accent">Coder</span></span>
          <Zap size={14} className="navbar__zap" />
        </Link>

        <ul className="navbar__links">
          {navLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={`navbar__link ${pathname === l.to ? 'navbar__link--active' : ''}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button className="navbar__burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <ul className="navbar__mobile">
          {navLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={`navbar__link ${pathname === l.to ? 'navbar__link--active' : ''}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
