import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lessons, PAGE_SIZE } from '../data/lessons';
import Topbar from '../components/Topbar';

function LessonsPage() {
  const navigate = useNavigate();

  const [lessonIdQuery, setLessonIdQuery] = useState('');
  const [lessonTitleQuery, setLessonTitleQuery] = useState('');
  const [lessonDateTime, setLessonDateTime] = useState('all');
  const [lessonDifficulty, setLessonDifficulty] = useState('all');
  const [lessonLocation, setLessonLocation] = useState('all');
  const [lessonCategory, setLessonCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueDates = useMemo(
    () => Array.from(new Set(lessons.map((lesson) => lesson.dateTime))),
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
    <section className="page">
      <Topbar 
        title="Lessons" 
        subtitle="Your learning programs at a glance." 
      />
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
                  />
                </th>
                <th>
                  Category
                  <select
                    className="header-select"
                    value={lessonCategory}
                    onChange={(event) => setLessonCategory(event.target.value)}
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
              </tr>
            </thead>
            <tbody>
              {pagedLessons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No lessons match your filters.
                  </td>
                </tr>
              ) : (
                pagedLessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="table-row"
                    onClick={() => navigate(`/lessons/${lesson.id}`)}
                  >
                    <td>{lesson.id}</td>
                    <td>{lesson.title}</td>
                    <td>{lesson.category}</td>
                    <td>{lesson.dateTime}</td>
                    <td>{lesson.difficulty}</td>
                    <td>{lesson.location}</td>
                    <td>{lesson.staff}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="page-button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          <button
            className="page-button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

export default LessonsPage;
