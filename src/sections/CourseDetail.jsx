import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDetail } from '../api';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { ChevronLeft, ChevronDown, ChevronUp, PlayCircle, Info, Image, BookOpen } from 'lucide-react';

function ItemIcon({ type }) {
  if (type === 'video') return <PlayCircle size={15} className="accent" />;
  if (type === 'logo') return <Image size={15} className="accent" />;
  return <Info size={15} className="accent" />;
}

export default function CourseDetail() {
  const { slug } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState(0); // open first by default
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setOpenSection(0);
    setOpenItem(null);
    getCourseDetail(slug)
      .then((res) => {
        setDetail(res.data?.data ?? res.data ?? null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="page-wrap"><Loader /></div>;
  if (error) return <div className="page-wrap"><ErrorMsg message={error} /></div>;
  if (!detail) return <div className="page-wrap"><ErrorMsg message="Course not found." /></div>;

  // real field: course_sections
  const sections = detail.course_sections ?? detail.sections ?? [];
  const totalItems = sections.reduce((a, s) => a + (s.course_items?.length ?? 0), 0);

  return (
    <div className="page-wrap">
      <Link to="/courses" className="btn btn--ghost btn--back">
        <ChevronLeft size={16} /> Back to Courses
      </Link>

      <div className="course-detail">
        <div className="course-detail__hero">
          {detail.img_url && (
            <img
              src={detail.img_url}
              alt={detail.title_kh ?? slug}
              className="course-detail__cover"
              onError={(e) => { e.target.style.display='none'; }}
            />
          )}
          <div className="course-detail__info">
            <span className="section__badge" style={{marginBottom:'12px'}}>
              <BookOpen size={14}/> {detail.category?.name ?? 'Course'}
            </span>
            <h1 className="course-detail__title">{detail.title_kh ?? detail.title ?? slug}</h1>
            {detail.short_desc && <p className="course-detail__desc">{detail.short_desc}</p>}
            <div className="course-detail__badges">
              <span className="chip chip--price">Free 🎉</span>
              <span className="chip">📂 {sections.length} Sections</span>
              <span className="chip">📖 {totalItems} Lessons</span>
            </div>
          </div>
        </div>

        {sections.length > 0 && (
          <div className="curriculum">
            <h2 className="curriculum__title">📋 Curriculum</h2>
            {sections.map((section, si) => (
              <div className="accordion" key={section.id ?? si}>
                <button
                  className="accordion__header"
                  onClick={() => setOpenSection(openSection === si ? null : si)}
                >
                  <span className="accordion__section-title">
                    <span className="accordion__section-num">{si + 1}</span>
                    {/* real field: section_title_kh */}
                    {section.section_title_kh ?? section.title ?? `Section ${si + 1}`}
                  </span>
                  <span className="accordion__section-count">
                    {section.course_items?.length ?? 0} lessons
                    {openSection === si ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>
                {openSection === si && (
                  <ul className="accordion__body">
                    {/* real field: course_items */}
                    {(section.course_items ?? []).map((item, ii) => {
                      const itemKey = `${si}-${ii}`;
                      const isOpen = openItem === itemKey;
                      return (
                        <li className="accordion__item accordion__item--expandable" key={item.id ?? ii}>
                          <button
                            className="accordion__item-header"
                            onClick={() => setOpenItem(isOpen ? null : itemKey)}
                          >
                            <ItemIcon type={item.type} />
                            {/* real field: item_title_kh */}
                            <span>{item.item_title_kh ?? item.title ?? `Lesson ${ii + 1}`}</span>
                            {item.item_description && (
                              isOpen ? <ChevronUp size={13} className="accordion__item-chevron" /> : <ChevronDown size={13} className="accordion__item-chevron" />
                            )}
                          </button>
                          {isOpen && item.item_description && (
                            <div className="accordion__item-desc">
                              {item.img_url && (
                                <img src={item.img_url} alt="" className="accordion__item-img"
                                  onError={(e)=>{e.target.style.display='none';}}/>
                              )}
                              <p>{item.item_description}</p>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
