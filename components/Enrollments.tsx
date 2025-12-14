import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Enrollment, Student, Course, EnrichedEnrollment } from '../types';
import { Plus, Pencil, Trash2, X, Check, Download, Search } from 'lucide-react';

const Enrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EnrichedEnrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<EnrichedEnrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Enrollment>({ id: '', studentId: '', courseId: '', grade: '', semester: '' });

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    setFilteredEnrollments(
      enrollments.filter(
        e =>
          e.studentName.toLowerCase().includes(lowerTerm) ||
          e.courseName.toLowerCase().includes(lowerTerm) ||
          e.semester.toLowerCase().includes(lowerTerm)
      )
    );
  }, [searchTerm, enrollments]);

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
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                type="text" 
                placeholder="Search enrollments..." 
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <button
                onClick={exportReport}
                className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-300 shadow-sm"
                >
                <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
                </button>
                <button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                <Plus size={18} /> <span className="hidden sm:inline">Enroll Student</span>
                </button>
            </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-800">{formData.id && enrollments.find(e => e.id === formData.id) ? 'Edit Enrollment' : 'New Enrollment'}</h3>
               <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
             </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                        <select
                        required
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-shadow"
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
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-shadow"
                        value={formData.courseId}
                        onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                        >
                            {courses.map(c => <option key={c.id} value={c.id}>{c.courseName} ({c.department})</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                        <input
                        type="text"
                        required
                        placeholder="e.g. Fall 2024"
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        value={formData.semester}
                        onChange={e => setFormData({ ...formData, semester: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
                        <select
                        required
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-shadow"
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
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-medium shadow-md shadow-blue-600/20"
                    >
                    <Check size={18} /> Save Record
                    </button>
                </div>
             </form>
           </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">ID</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Student</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Course</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Semester</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Grade</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnrollments.map(enrollment => (
                <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 text-slate-500 font-mono text-sm">#{enrollment.id}</td>
                  <td className="p-4 font-medium text-slate-800">{enrollment.studentName}</td>
                  <td className="p-4 text-slate-600">{enrollment.courseName}</td>
                  <td className="p-4 text-slate-600">{enrollment.semester}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        enrollment.grade === 'A' ? 'bg-green-100 text-green-700 border-green-200' :
                        enrollment.grade === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                        {enrollment.grade}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(enrollment)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(enrollment.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEnrollments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="opacity-20" />
                        <p>No enrollments found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Enrollments;