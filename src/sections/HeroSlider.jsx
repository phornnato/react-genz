import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSliders } from '../api';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    getSliders()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setSlides(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4500);
    return () => clearInterval(timerRef.current);
  }, [slides]);

  const go = (dir) => {
    clearInterval(timerRef.current);
    setCurrent((c) => (c + dir + slides.length) % slides.length);
  };

  if (loading) return <section className="hero-section"><Loader /></section>;
  if (error) return <section className="hero-section"><ErrorMsg message={error} /></section>;

  return (
    <section className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-slider">
        {slides.map((slide, i) => (
          <div
            key={slide.id ?? i}
            className={`hero-slide ${i === current ? 'hero-slide--active' : ''}`}
            style={{ backgroundImage: `url(${slide.image ?? slide.img ?? ''})` }}
          >
            {(slide.title || slide.description) && (
              <div className="hero-slide__caption">
                {slide.title && <h1 className="hero-slide__title">{slide.title}</h1>}
                {slide.description && <p className="hero-slide__desc">{slide.description}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="hero-btn hero-btn--left" onClick={() => go(-1)}><ChevronLeft size={28} /></button>
      <button className="hero-btn hero-btn--right" onClick={() => go(1)}><ChevronRight size={28} /></button>

      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} className={`hero-dot ${i === current ? 'hero-dot--active' : ''}`} onClick={() => { clearInterval(timerRef.current); setCurrent(i); }} />
        ))}
      </div>

      <div className="hero-cta">
        <h2 className="hero-cta__heading">រៀនCode ជាមួយ <span className="accent">GenzCoder</span> 🔥</h2>
        <p className="hero-cta__sub">Learn. Build. Ship. Repeat.</p>
        <a href="#courses" className="btn btn--primary">Explore Courses</a>
      </div>
    </section>
  );
}
