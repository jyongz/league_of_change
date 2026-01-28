import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lessons, PAGE_SIZE } from '../data/lessons';
import Topbar from '../components/Topbar';

function LessonsPage({ onMenuToggle }) {
  const navigate = useNavigate();

  const [lessonIdQuery, setLessonIdQuery] = useState('');
  const [lessonTitleQuery, setLessonTitleQuery] = useState('');
  const [lessonDateTime, setLessonDateTime] = useState('all');
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
    dateTime: '',
    location: '',
    staff: ''
  });

  const handleOpenCreateModal = () => {
    setEditingLesson(null);
    setFormData({
      title: '',
      category: '',
      difficulty: '',
      dateTime: '',
      location: '',
      staff: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      category: lesson.category,
      difficulty: lesson.difficulty,
      dateTime: lesson.dateTime,
      location: lesson.location,
      staff: lesson.staff
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uniqueDates = useMemo(
    () => Array.from(new Set(lessons.filter(l => l.dateTime).map((lesson) => lesson.dateTime))),
    []
  );
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

    return lessons.filter((lesson) => {
      const matchesId =
        idQuery.length === 0 || lesson.id.toLowerCase() === idQuery;

      const matchesTitle =
        titleQuery.length === 0 ||
        lesson.title.toLowerCase().includes(titleQuery);

      const matchesDate =
        lessonDateTime === 'all' || lesson.dateTime === lessonDateTime;

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
        <button className="cta-button" onClick={handleOpenCreateModal}>
          + New Lesson
        </button>
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
                    placeholder="Exact match"
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
                  <select
                    className="header-select"
                    value={lessonDateTime}
                    onChange={(event) => setLessonDateTime(event.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="all">All</option>
                    {uniqueDates.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
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
                <th>Teaching Staff</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {pagedLessons.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No lessons match your filters.
                  </td>
                </tr>
              ) : (
                pagedLessons.map((lesson) => (
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
                            <button onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(null);
                              handleOpenEditModal(lesson);
                            }}>Edit</button>
                            <button className="delete" onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(null);
                            }}>Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
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
                  <label>Date & Time</label>
                  <input 
                    type="text" 
                    name="dateTime"
                    placeholder="e.g. Feb 04 • 18:30" 
                    value={formData.dateTime}
                    onChange={handleFormChange}
                  />
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
              </div>
              <div className="form-group">
                <label>Teaching Staff</label>
                <input 
                  type="text" 
                  name="staff"
                  placeholder="e.g. A. Patel" 
                  value={formData.staff}
                  onChange={handleFormChange}
                  required 
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
