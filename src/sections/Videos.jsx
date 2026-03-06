import { useEffect, useState } from 'react';
import { getVideoCategories, getVideoPlaylist } from '../api';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { PlayCircle, Layers, User, ExternalLink } from 'lucide-react';

function YtThumb({ youtubeId }) {
  const [hq, setHq] = useState(true);
  const src = hq
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  return (
    <img
      src={src}
      alt="thumbnail"
      className="card__thumb"
      onError={() => setHq(false)}
    />
  );
}

export default function Videos() {
  const [categories, setCategories] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getVideoCategories(), getVideoPlaylist()])
      .then(([catRes, playRes]) => {
        const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data?.data ?? [];
        const plays = Array.isArray(playRes.data) ? playRes.data : playRes.data?.data ?? [];
        setCategories(cats);
        setPlaylist(plays);
        // default to "All"
        setActiveCategory(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // real field: vd_category_id
  const filtered = activeCategory !== null
    ? playlist.filter((v) => v.vd_category_id === activeCategory)
    : playlist;

  if (loading) return <section className="section"><Loader /></section>;
  if (error) return <section className="section"><ErrorMsg message={error} /></section>;

  return (
    <section className="section" id="videos">
      <div className="section__head">
        <span className="section__badge"><PlayCircle size={16} /> Video Library</span>
        <h2 className="section__title">Watch & <span className="accent">Learn</span> 🎬</h2>
        <p className="section__sub">Free tutorials curated for Cambodian developers</p>
      </div>

      {categories.length > 0 && (
        <div className="cat-tabs">
          <button
            className={`cat-tab ${activeCategory === null ? 'cat-tab--active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            <Layers size={14} /> All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-tab ${activeCategory === cat.id ? 'cat-tab--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name ?? '—'}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid--3">
        {filtered.map((video, i) => (
          <a
            href={video.url ?? `https://youtu.be/${video.youtube_id}`}
            target="_blank"
            rel="noreferrer"
            className="card card--video"
            key={video.id ?? i}
          >
            <div className="card__thumb-wrap">
              {video.youtube_id ? (
                <YtThumb youtubeId={video.youtube_id} />
              ) : (
                <div className="card__thumb-placeholder"><PlayCircle size={48} /></div>
              )}
              <div className="card__play-overlay">
                <div className="yt-play-btn"><PlayCircle size={44} /></div>
              </div>
              {video.sub_category?.sub_name && (
                <span className="card__vid-sub-badge">{video.sub_category.sub_name}</span>
              )}
            </div>
            <div className="card__body">
              <h3 className="card__video-title">{video.title ?? '—'}</h3>
              <div className="card__vid-meta">
                {video.author && <span className="card__vid-author"><User size={12}/> {video.author}</span>}
                <span className="card__vid-yt"><ExternalLink size={12}/> YouTube</span>
              </div>
              {(video.duration ?? video.views) && (
                <div className="card__meta">
                  {video.duration && <span>⏱ {video.duration}</span>}
                  {video.views && <span>👁 {video.views}</span>}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
