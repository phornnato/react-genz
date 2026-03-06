import { useEffect, useState, useCallback } from 'react';
import { getVideoCategories, getVideoPlaylist } from '../api';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { PlayCircle, Layers, User, X, ChevronRight } from 'lucide-react';

/* ── YouTube thumbnail with HQ → MQ fallback ─────────────── */
function YtThumb({ youtubeId, className = 'card__thumb' }) {
  const [quality, setQuality] = useState('maxresdefault');
  const fallbacks = ['hqdefault', 'mqdefault'];
  const src = `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
  return (
    <img
      src={src}
      alt="thumbnail"
      className={className}
      onError={() => {
        const next = fallbacks[fallbacks.indexOf(quality) + 1];
        if (next) setQuality(next);
      }}
    />
  );
}

/* ── YouTube modal player ─────────────────────────────────── */
function VideoModal({ video, onClose }) {
  const handleKey = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div className="yt-modal" onClick={onClose}>
      <div className="yt-modal__box" onClick={(e) => e.stopPropagation()}>
        <button className="yt-modal__close" onClick={onClose}><X size={20} /></button>
        <div className="yt-modal__player">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
        <div className="yt-modal__info">
          <h2 className="yt-modal__title">{video.title}</h2>
          <div className="yt-modal__meta">
            {video.author && <span><User size={13} /> {video.author}</span>}
            {video.category?.name && <span className="chip" style={{fontSize:'0.72rem',padding:'2px 10px'}}>{video.category.name}</span>}
            {video.sub_category?.sub_name && <span className="chip" style={{fontSize:'0.72rem',padding:'2px 10px'}}>{video.sub_category.sub_name}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main section ─────────────────────────────────────────── */
export default function Videos() {
  const [categories, setCategories] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getVideoCategories(), getVideoPlaylist()])
      .then(([catRes, playRes]) => {
        const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data?.data ?? [];
        const plays = Array.isArray(playRes.data) ? playRes.data : playRes.data?.data ?? [];
        setCategories(cats);
        setPlaylist(plays);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory !== null
    ? playlist.filter((v) => v.vd_category_id === activeCategory)
    : playlist;

  const [featured, ...rest] = filtered;

  if (loading) return <section className="section"><Loader /></section>;
  if (error) return <section className="section"><ErrorMsg message={error} /></section>;

  return (
    <section className="section" id="videos">
      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}

      <div className="section__head">
        <span className="section__badge"><PlayCircle size={16} /> Video Library</span>
        <h2 className="section__title">Watch & <span className="accent">Learn</span> 🎬</h2>
        <p className="section__sub">Free video tutorials curated for Cambodian developers 🇰🇭</p>
      </div>

      {/* Category tabs */}
      {categories.length > 0 && (
        <div className="cat-tabs">
          <button className={`cat-tab ${activeCategory === null ? 'cat-tab--active' : ''}`} onClick={() => setActiveCategory(null)}>
            <Layers size={13} /> All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-tab ${activeCategory === cat.id ? 'cat-tab--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Featured video */}
      {featured && (
        <div className="vid-featured" role="button" tabIndex={0}
          onClick={() => setPlaying(featured)}
          onKeyDown={(e) => e.key === 'Enter' && setPlaying(featured)}
        >
          <div className="vid-featured__thumb">
            {featured.youtube_id
              ? <YtThumb youtubeId={featured.youtube_id} className="vid-featured__img" />
              : <div className="vid-featured__placeholder"><PlayCircle size={64} /></div>
            }
            <div className="vid-featured__overlay">
              <div className="vid-featured__play"><PlayCircle size={56} /></div>
            </div>
            {featured.sub_category?.sub_name && (
              <span className="card__vid-sub-badge">{featured.sub_category.sub_name}</span>
            )}
          </div>
          <div className="vid-featured__info">
            <span className="section__badge" style={{marginBottom:'12px',fontSize:'0.72rem'}}>⭐ Featured</span>
            <h2 className="vid-featured__title">{featured.title}</h2>
            {featured.author && (
              <p className="vid-featured__author"><User size={14} /> {featured.author}</p>
            )}
            {featured.category?.name && (
              <span className="chip" style={{marginTop:'8px'}}>{featured.category.name}</span>
            )}
            <div className="btn btn--primary vid-featured__btn" style={{pointerEvents:'none'}}>
              <PlayCircle size={16} /> Watch Now
            </div>
          </div>
        </div>
      )}

      {/* Rest of videos */}
      {rest.length > 0 && (
        <>
          <div className="vid-grid-header">
            <h3 className="vid-grid-header__title">More Videos <ChevronRight size={18}/></h3>
          </div>
          <div className="grid grid--3">
            {rest.map((video, i) => (
              <div
                className="card card--video"
                key={video.id ?? i}
                role="button"
                tabIndex={0}
                onClick={() => setPlaying(video)}
                onKeyDown={(e) => e.key === 'Enter' && setPlaying(video)}
              >
                <div className="card__thumb-wrap">
                  {video.youtube_id
                    ? <YtThumb youtubeId={video.youtube_id} />
                    : <div className="card__thumb-placeholder"><PlayCircle size={48} /></div>
                  }
                  <div className="card__play-overlay">
                    <div className="yt-play-btn"><PlayCircle size={40} /></div>
                  </div>
                  {video.sub_category?.sub_name && (
                    <span className="card__vid-sub-badge">{video.sub_category.sub_name}</span>
                  )}
                </div>
                <div className="card__body">
                  <h3 className="card__video-title">{video.title}</h3>
                  <div className="card__vid-meta">
                    {video.author && <span className="card__vid-author"><User size={12}/> {video.author}</span>}
                    <span className="card__vid-cat">{video.category?.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
