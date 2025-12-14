import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Enrollment, Student, Course, EnrichedEnrollment } from '../types';
import { Plus, Pencil, Trash2, X, Check, Download } from 'lucide-react';

const Enrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EnrichedEnrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Enrollment>({ id: '', studentId: '', courseId: '', grade: '', semester: '' });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const rawEnrollments = db.getEnrollments();
    const rawStudents = db.getStudents();
    const rawCourses = db.getCourses();

    setStudents(rawStudents);
    setCourses(rawCourses);

    // Join data for display (Simulating a SQL JOIN)
    const enriched = rawEnrollments.map(e => {
      const s = rawStudents.find(student => student.id === e.studentId);
      const c = rawCourses.find(course => course.id === e.courseId);
      return {
        ...e,
        studentName: s ? s.fullName : 'Unknown Student',
        courseName: c ? c.courseName : 'Unknown Course'
      };
    });
    setEnrollments(enriched);
  };

  const handleEdit = (enrollment: Enrollment) => {
    setFormData(enrollment);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setFormData({ 
        id: Date.now().toString(), 
        studentId: students.length > 0 ? students[0].id : '', 
        courseId: courses.length > 0 ? courses[0].id : '', 
        grade: 'Pending', 
        semester: 'Fall 2024' 
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveEnrollment(formData);
    setIsEditing(false);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this enrollment record?')) {
      db.deleteEnrollment(id);
      refreshData();
    }
  };

  const exportReport = () => {
    // Generate CSV content
    const headers = ['Enrollment ID', 'Student Name', 'Course Name', 'Semester', 'Grade'];
    const rows = enrollments.map(e => [
      e.id,
      `"${e.studentName}"`, // Quote names in case of commas
      `"${e.courseName}"`,
      e.semester,
      e.grade
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(row => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enrollment_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Enrollment Records</h2>
        <div className="flex gap-2">
            <button
            onClick={exportReport}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-300"
            >
            <Download size={18} /> Export CSV
            </button>
            <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
            <Plus size={18} /> Enroll Student
            </button>
        </div>
      </div>

      {isEditing && (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-inner">
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                <select
                  required
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                >
                    {students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                <select
                  required
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.courseId}
                  onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                >
                    {courses.map(c => <option key={c.id} value={c.id}>{c.courseName} ({c.department})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fall 2024"
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
                <select
                  required
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.grade}
                  onChange={e => setFormData({ ...formData, grade: e.target.value })}
                >
                    <option value="Pending">Pending</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                >
                  <Check size={18} /> Save
                </button>
              </div>
           </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600">ID</th>
              <th className="p-4 font-semibold text-slate-600">Student</th>
              <th className="p-4 font-semibold text-slate-600">Course</th>
              <th className="p-4 font-semibold text-slate-600">Semester</th>
              <th className="p-4 font-semibold text-slate-600">Grade</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrollments.map(enrollment => (
              <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-500 font-mono text-sm">#{enrollment.id}</td>
                <td className="p-4 font-medium text-slate-800">{enrollment.studentName}</td>
                <td className="p-4 text-slate-600">{enrollment.courseName}</td>
                <td className="p-4 text-slate-600">{enrollment.semester}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    enrollment.grade === 'A' ? 'bg-green-100 text-green-700' :
                    enrollment.grade === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {enrollment.grade}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(enrollment)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(enrollment.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">No enrollments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enrollments;