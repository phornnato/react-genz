import { useEffect, useState } from 'react';
import { getContacts } from '../api';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { Mail, Calendar } from 'lucide-react';

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getContacts()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setContacts(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section"><Loader /></section>;
  if (error) return <section className="section"><ErrorMsg message={error} /></section>;

  return (
    <section className="section" id="contact">
      <div className="section__head">
        <span className="section__badge"><Mail size={16} /> Inbox</span>
        <h2 className="section__title">Contact <span className="accent">Messages</span> 💬</h2>
        <p className="section__sub">User submissions received via the contact form</p>
      </div>

      {contacts.length === 0 ? (
        <p className="empty-state">No messages yet. 📭</p>
      ) : (
        <div className="contact-table-wrap">
          <table className="contact-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={c.id ?? i}>
                  <td>{i + 1}</td>
                  <td>{c.name ?? '—'}</td>
                  <td>{c.email ?? '—'}</td>
                  <td>{c.phone ?? c.tel ?? '—'}</td>
                  <td className="contact-table__msg">{c.message ?? c.content ?? '—'}</td>
                  <td>
                    <span className="contact-date">
                      <Calendar size={12} />
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
