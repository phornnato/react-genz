import { useEffect, useState } from 'react';
import { getTools } from '../api';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { Wrench } from 'lucide-react';

export default function DevTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTools()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setTools(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section"><Loader /></section>;
  if (error) return <section className="section"><ErrorMsg message={error} /></section>;

  return (
    <section className="section section--dark" id="tools">
      <div className="section__head">
        <span className="section__badge"><Wrench size={16} /> Dev Stack</span>
        <h2 className="section__title">Tools We <span className="accent">Use</span> ⚡</h2>
        <p className="section__sub">The software & tech powering our courses and projects</p>
      </div>

      <div className="grid grid--5">
        {tools.map((tool, i) => (
          <div className="card card--tool" key={tool.id ?? i}>
            {(tool.image ?? tool.img ?? tool.icon) ? (
              <img
                src={tool.image ?? tool.img ?? tool.icon}
                alt={tool.name ?? 'Tool'}
                className="card__tool-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="card__tool-placeholder"><Wrench size={32} /></div>
            )}
            <p className="card__tool-name">{tool.name ?? '—'}</p>
            {tool.description && <p className="card__tool-desc">{tool.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
