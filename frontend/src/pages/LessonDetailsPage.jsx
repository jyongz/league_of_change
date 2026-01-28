import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { lessons } from '../data/lessons';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

function LessonDetailsPage({ onMenuToggle }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const canEdit = user && (user.role === 'admin' || user.role === 'coach');
  const lesson = lessons.find((item) => item.id === lessonId);

  const [lessonOverview, setLessonOverview] = useState(lesson?.description || []);
  const [lessonFiles, setLessonFiles] = useState(lesson?.files || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: ''
  });

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

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    // Simulate API call
    setLessonOverview([
      "This is an AI-generated overview based on your input.",
      "The lesson plan has been generated and added to the related files section for your review.",
      "Dummy text for category: " + formData.category,
      "Dummy text for description: " + formData.description
    ]);
    
    if (!lessonFiles.includes('AI_Lesson_Plan.pdf')) {
      setLessonFiles([...lessonFiles, 'AI_Lesson_Plan.pdf']);
    }
    
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
              <span>Staff ID</span>
              <strong>{lesson.staff}</strong>
            </li>
          </ul>
        </div>

        <div className="detail-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Overview</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {canEdit && lessonOverview.length === 0 && lessonFiles.length === 0 && (
                <button className="cta-button" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setIsModalOpen(true)}>
                  Generate Plan
                </button>
              )}
              {canEdit && (
                <button className="ghost" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => {}}>
                  Edit
                </button>
              )}
            </div>
          </div>
          {lessonOverview.length > 0 ? (
            lessonOverview.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No overview available.</p>
          )}
        </div>
      </div>

      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="panel-title" style={{ margin: 0 }}>Related Files</h3>
          {canEdit && (
            <button className="ghost" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => {}}>
              Add File
            </button>
          )}
        </div>
        {lessonFiles.length > 0 ? (
          <ul className="file-list">
            {lessonFiles.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        ) : (
          <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No files added.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Generate Lesson Plan</h2>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleGeneratePlan}>
              <div className="form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  name="category"
                  placeholder="e.g. Technical Skills" 
                  value={formData.category}
                  onChange={handleFormChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description"
                  placeholder="Describe the desired lesson content..." 
                  value={formData.description}
                  onChange={handleFormChange}
                  required 
                  style={{ minHeight: '100px' }}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="cta-button">
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default LessonDetailsPage;
