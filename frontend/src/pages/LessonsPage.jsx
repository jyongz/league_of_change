import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lessons, PAGE_SIZE } from '../data/lessons';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

function LessonsPage({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = user && (user.role === 'admin' || user.role === 'coach');
  const isAdmin = user && user.role === 'admin';

  const [lessonIdQuery, setLessonIdQuery] = useState('');
  const [lessonTitleQuery, setLessonTitleQuery] = useState('');
  const [lessonDateTime, setLessonDateTime] = useState('');
  const [lessonDifficulty, setLessonDifficulty] = useState('all');
  const [lessonLocation, setLessonLocation] = useState('all');
  const [lessonCategory, setLessonCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    difficulty: '',
    date: '',
    time: '',
    location: '',
    staff: '',
    overview: ''
  });

  const handleOpenCreateModal = () => {
    setEditingLesson(null);
    setFormData({
      title: '',
      category: '',
      difficulty: '',
      date: '',
      time: '',
      location: '',
      staff: 'STF-',
      overview: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lesson) => {
    setEditingLesson(lesson);
    
    let defaultDate = '';
    let defaultTime = '';
    
    if (lesson.dateTime && lesson.dateTime.includes(' • ')) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const parts = lesson.dateTime.split(' • ');
      const dateParts = parts[0].split(' '); // ["Feb", "04"]
      const monthIdx = monthNames.indexOf(dateParts[0]);
      const day = dateParts[1];
      if (monthIdx !== -1) {
        defaultDate = `2026-${(monthIdx + 1).toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      defaultTime = parts[1];
    }

    setFormData({
      title: lesson.title,
      category: lesson.category,
      difficulty: lesson.difficulty,
      date: defaultDate,
      time: defaultTime,
      location: lesson.location,
      staff: lesson.staff,
      overview: lesson.description ? lesson.description.join('\n') : ''
    });
    setIsModalOpen(true);
  };

  const handleGenerateAI = () => {
    // Replace with the API if there's time
    const aiText = `AI Generated Overview for ${formData.title || 'this lesson'}:
- Focus on key learning outcomes related to ${formData.category || 'the selected category'}.
- Structure the session into Warm-up, Core Skills, and cool-down.
- Ensure all safety protocols are followed for ${formData.location || 'the venue'}.`;
    
    setFormData(prev => ({ ...prev, overview: aiText }));
  };

  const handleUploadOCR = () => {
    // Simulate OCR upload and decoding
    alert("OCR feature: Select a file to scan. (System: OCR logic will decode the image and populate the overview field).");
    // Placeholder for demo
    setFormData(prev => ({ ...prev, overview: prev.overview + "\n[OCR DECODED TEXT: Foundations of movement and rhythmic control...]" }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uniqueDifficulties = useMemo(
    () => Array.from(new Set(lessons.map((lesson) => lesson.difficulty))),
    []
  );
  const uniqueLocations = useMemo(
    () => Array.from(new Set(lessons.map((lesson) => lesson.location))),
    []
  );
  const uniqueCategories = useMemo(
    () => Array.from(new Set(lessons.map((lesson) => lesson.category))),
    []
  );

  const filteredLessons = useMemo(() => {
    const idQuery = lessonIdQuery.trim().toLowerCase();
    const titleQuery = lessonTitleQuery.trim().toLowerCase();

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return lessons.filter((lesson) => {
      const matchesId =
        idQuery.length === 0 || lesson.id.toLowerCase().includes(idQuery);

      const matchesTitle =
        titleQuery.length === 0 ||
        lesson.title.toLowerCase().includes(titleQuery);

      let matchesDate = true;
      if (lessonDateTime) {
        if (!lesson.dateTime) {
          matchesDate = false;
        } else {
          // lessonDateTime is YYYY-MM-DD
          // lesson.dateTime is Month Day • HH:mm (e.g., "Feb 04 • 18:30")
          const [_, month, day] = lessonDateTime.split('-').map(Number);
          const monthAbbr = monthNames[month - 1];
          const dayStr = day.toString().padStart(2, '0');
          const datePrefix = `${monthAbbr} ${dayStr}`;
          matchesDate = lesson.dateTime.startsWith(datePrefix);
        }
      }

      const matchesDifficulty =
        lessonDifficulty === 'all' || lesson.difficulty === lessonDifficulty;

      const matchesLocation =
        lessonLocation === 'all' || lesson.location === lessonLocation;

      const matchesCategory =
        lessonCategory === 'all' || lesson.category === lessonCategory;

      return (
        matchesId &&
        matchesTitle &&
        matchesDate &&
        matchesDifficulty &&
        matchesLocation &&
        matchesCategory
      );
    });
  }, [
    lessonIdQuery,
    lessonTitleQuery,
    lessonDateTime,
    lessonDifficulty,
    lessonLocation,
    lessonCategory,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    lessonIdQuery,
    lessonTitleQuery,
    lessonDateTime,
    lessonDifficulty,
    lessonLocation,
    lessonCategory,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredLessons.length / PAGE_SIZE));
  const pagedLessons = filteredLessons.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <section className="page" onClick={() => setActiveMenuId(null)}>
      <Topbar 
        title="Lessons" 
        subtitle="Your learning programs at a glance." 
        onMenuToggle={onMenuToggle}
      />

      <div className="page-actions">
        {canEdit && (
          <button className="cta-button" onClick={handleOpenCreateModal}>
            + New Lesson
          </button>
        )}
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="lessons-table">
            <thead>
              <tr>
                <th>
                  Lesson ID
                  <input
                    className="header-input"
                    type="search"
                    placeholder="Partial match"
                    value={lessonIdQuery}
                    onChange={(event) => setLessonIdQuery(event.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th>
                  Lesson Title
                  <input
                    className="header-input"
                    type="search"
                    placeholder="Partial match"
                    value={lessonTitleQuery}
                    onChange={(event) => setLessonTitleQuery(event.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th>
                  Category
                  <select
                    className="header-select"
                    value={lessonCategory}
                    onChange={(event) => setLessonCategory(event.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="all">All</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </th>
                <th>
                  Date &amp; Time
                  <input
                    className="header-date"
                    type="date"
                    value={lessonDateTime}
                    onChange={(event) => setLessonDateTime(event.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th>
                  Difficulty
                  <select
                    className="header-select"
                    value={lessonDifficulty}
                    onChange={(event) => setLessonDifficulty(event.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="all">All</option>
                    {uniqueDifficulties.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </th>
                <th>
                  Location
                  <select
                    className="header-select"
                    value={lessonLocation}
                    onChange={(event) => setLessonLocation(event.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="all">All</option>
                    {uniqueLocations.map((place) => (
                      <option key={place} value={place}>
                        {place}
                      </option>
                    ))}
                  </select>
                </th>
                <th>Staff ID</th>
                {isAdmin && (
                  <>
                    <th>Attendance Rate</th>
                    <th>Average Score</th>
                    <th>Completion Rate</th>
                    <th>Lesson Rating</th>
                  </>
                )}
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {pagedLessons.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? "12" : "8"} className="empty-state">
                    No lessons match your filters.
                  </td>
                </tr>
              ) : (
                pagedLessons.map((lesson) => {
                  const rating = isAdmin 
                    ? (lesson.attendanceRate * 0.2 + lesson.averageScore * 0.3 + lesson.completionRate * 0.5).toFixed(1)
                    : null;
                  
                  return (
                    <tr
                      key={lesson.id}
                      className="table-row"
                    >
                      <td onClick={() => navigate(`/lessons/${lesson.id}`)}>{lesson.id}</td>
                      <td onClick={() => navigate(`/lessons/${lesson.id}`)}>{lesson.title}</td>
                      <td onClick={() => navigate(`/lessons/${lesson.id}`)}>{lesson.category}</td>
                      <td onClick={() => navigate(`/lessons/${lesson.id}`)}>{lesson.dateTime}</td>
                      <td onClick={() => navigate(`/lessons/${lesson.id}`)}>{lesson.difficulty}</td>
                      <td onClick={() => navigate(`/lessons/${lesson.id}`)}>{lesson.location}</td>
                      <td onClick={() => navigate(`/lessons/${lesson.id}`)}>{lesson.staff}</td>
                      {isAdmin && (
                        <>
                          <td onClick={() => navigate(`/lessons/${lesson.id}`)}>{lesson.attendanceRate}%</td>
                          <td onClick={() => navigate(`/lessons/${lesson.id}`)}>{lesson.averageScore}</td>
                          <td onClick={() => navigate(`/lessons/${lesson.id}`)}>{lesson.completionRate}%</td>
                          <td onClick={() => navigate(`/lessons/${lesson.id}`)}>
                            <span className={`rating-badge ${rating > 80 ? 'high' : rating > 50 ? 'medium' : 'low'}`}>
                              {rating}
                            </span>
                          </td>
                        </>
                      )}
                      <td className="actions-cell">
                      <div className="action-menu-container">
                        <button 
                          className="action-dots"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === lesson.id ? null : lesson.id);
                          }}
                        >
                          ⋮
                        </button>
                        {activeMenuId === lesson.id && (
                          <div className="action-dropdown">
                            <button onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(null);
                              navigate(`/lessons/${lesson.id}`);
                            }}>View</button>
                            {canEdit && (
                              <>
                                <button onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                  handleOpenEditModal(lesson);
                                }}>Edit</button>
                                <button className="delete" onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                }}>Delete</button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>

        <div className="pagination">
          <button
            className="page-button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPage((page) => Math.max(1, page - 1));
            }}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          <button
            className="page-button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPage((page) => Math.min(totalPages, page + 1));
            }}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</h2>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div className="form-group">
                <label>Lesson Title</label>
                <input 
                  type="text" 
                  name="title"
                  placeholder="e.g. Street Skills Foundations" 
                  value={formData.title}
                  onChange={handleFormChange}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select 
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Difficulty</option>
                    {uniqueDifficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input 
                    type="time" 
                    name="time"
                    value={formData.time}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location"
                  placeholder="e.g. Hackney Hub" 
                  value={formData.location}
                  onChange={handleFormChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Staff ID</label>
                <input 
                  type="text" 
                  name="staff"
                  placeholder="e.g. STF-001" 
                  value={formData.staff}
                  onChange={handleFormChange}
                  required 
                />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Lesson Overview</label>
                  <div className="tool-buttons">
                    <button type="button" className="ghost small" onClick={handleGenerateAI} title="Generate overview using AI">
                      Generate via AI
                    </button>
                    <button type="button" className="ghost small" onClick={handleUploadOCR} title="Upload image/scan to extract text">
                      Upload
                    </button>
                  </div>
                </div>
                <textarea 
                  name="overview"
                  placeholder="Enter lesson overview or use automated tools..." 
                  value={formData.overview}
                  onChange={handleFormChange}
                  style={{ minHeight: '120px' }}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="cta-button">
                  {editingLesson ? 'Save Changes' : 'Create Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default LessonsPage;
