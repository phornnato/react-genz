import { useEffect, useState } from 'react';
import { getAbout } from '../api';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { Users } from 'lucide-react';

export default function AboutTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAbout()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setTeam(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section"><Loader /></section>;
  if (error) return <section className="section"><ErrorMsg message={error} /></section>;

  return (
    <section className="section" id="about">
      <div className="section__head">
        <span className="section__badge"><Users size={16} /> Our Team</span>
        <h2 className="section__title">Meet the <span className="accent">Crew</span> 👾</h2>
        <p className="section__sub">The humans behind GenzCoder — passionate devs building for Cambodia 🇰🇭</p>
      </div>

      <div className="grid grid--4">
        {team.map((member, i) => (
          <div className="card card--team" key={member.id ?? i}>
            <div className="card__avatar-wrap">
              <img
                src={member.image ?? member.img ?? member.photo ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name ?? 'GZ')}&background=1e40af&color=fff&size=128`}
                alt={member.name ?? 'Team member'}
                className="card__avatar"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=GZ&background=1e40af&color=fff&size=128`; }}
              />
              <div className="card__avatar-glow" />
            </div>
            <h3 className="card__name">{member.name ?? '—'}</h3>
            <p className="card__role chip">{member.role ?? member.position ?? 'Developer'}</p>
            {member.description && <p className="card__desc">{member.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
