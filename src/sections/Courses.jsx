import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../api';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { BookOpen, ArrowRight, Star } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCourses()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setCourses(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section"><Loader /></section>;
  if (error) return <section className="section"><ErrorMsg message={error} /></section>;

  return (
    <section className="section section--dark" id="courses">
      <div className="section__head">
        <span className="section__badge"><BookOpen size={16} /> Courses</span>
        <h2 className="section__title">Start <span className="accent">Learning</span> Now 📚</h2>
        <p className="section__sub">កម្មវិធីបណ្តុះបណ្តាលគ្រប់ Level សម្រាប់ Developer ជំនាន់ថ្មី 🇰🇭</p>
      </div>

      <div className="grid grid--3">
        {courses.map((course, i) => (
          <Link
            to={`/courses/${course.slug ?? course.id}`}
            className="card card--course"
            key={course.id ?? i}
          >
            <div className="card__course-img-wrap">
              {/* real field: img_url */}
              {course.img_url ? (
                <img
                  src={course.img_url}
                  alt={course.title_kh ?? 'Course'}
                  className="card__course-img"
                  onError={(e) => { e.target.style.display='none'; }}
                />
              ) : (
                <div className="card__course-img-placeholder"><BookOpen size={48} /></div>
              )}
              {course.category?.name && (
                <span className="card__level-badge">{course.category.name}</span>
              )}
            </div>
            <div className="card__body">
              {/* real title field: title_kh */}
              <h3 className="card__course-title">{course.title_kh ?? course.title ?? '—'}</h3>
              {/* real desc field: short_desc */}
              {course.short_desc && <p className="card__course-desc">{course.short_desc}</p>}
              <div className="card__course-meta">
                {course.lessons_count != null && <span>📖 {course.lessons_count} Lessons</span>}
                {course.students_count != null && <span>👤 {course.students_count}</span>}
                {course.rating != null && <span><Star size={12} className="accent" /> {course.rating}</span>}
              </div>
              <div className="card__course-footer">
                {course.price != null ? (
                  <span className="chip chip--price">{course.price === 0 || course.price === '0' ? 'Free 🎉' : `$${course.price}`}</span>
                ) : <span className="chip chip--price">Free 🎉</span>}
                <span className="card__course-cta">View Course <ArrowRight size={14} /></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
