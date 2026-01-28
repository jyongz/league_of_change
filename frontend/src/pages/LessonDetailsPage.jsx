import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { lessons } from '../data/lessons';
import Topbar from '../components/Topbar';

function LessonDetailsPage({ onMenuToggle }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lesson = lessons.find((item) => item.id === lessonId);

  const fromSchedule = location.state?.from === 'schedule';

  if (!lesson) {
    return (
      <section className="page">
        <Topbar 
          title="Lesson Not Found" 
          subtitle="We couldn’t find that lesson." 
          onMenuToggle={onMenuToggle}
        />
        <div className="detail-header-actions">
          <button className="ghost" onClick={() => navigate(fromSchedule ? '/schedule' : '/lessons')}>
            {fromSchedule ? 'Back to Schedule' : 'Back to Lessons'}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <Topbar 
        title={lesson.title} 
        subtitle={`Lesson ID: ${lesson.id}`} 
        onMenuToggle={onMenuToggle}
      />
      <div className="detail-header-actions">
        <button className="ghost" onClick={() => navigate(fromSchedule ? '/schedule' : '/lessons')}>
          {fromSchedule ? 'Back to Schedule' : 'Back to Lessons'}
        </button>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Lesson Details</h3>
          <ul>
            <li>
              <span>Category</span>
              <strong>{lesson.category}</strong>
            </li>
            <li>
              <span>Duration</span>
              <strong>{lesson.duration}</strong>
            </li>
            <li>
              <span>Difficulty</span>
              <strong>{lesson.difficulty}</strong>
            </li>
            <li>
              <span>Delivery</span>
              <strong>{lesson.delivery}</strong>
            </li>
            <li>
              <span>Location</span>
              <strong>{lesson.location}</strong>
            </li>
            <li>
              <span>Teaching Staff</span>
              <strong>{lesson.staff}</strong>
            </li>
          </ul>
        </div>

        <div className="detail-card">
          <h3>Overview</h3>
          {lesson.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-title">Related Files</h3>
        <ul className="file-list">
          {lesson.files.map((file) => (
            <li key={file}>{file}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default LessonDetailsPage;
