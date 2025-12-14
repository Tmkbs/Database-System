import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Course } from '../types';
import { Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Course>({ id: '', courseName: '', credits: 0, department: '' });

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    setFilteredCourses(
      courses.filter(
        c =>
          c.courseName.toLowerCase().includes(lowerTerm) ||
          c.department.toLowerCase().includes(lowerTerm) ||
          c.id.includes(lowerTerm)
      )
    );
  }, [searchTerm, courses]);

  const refreshData = () => {
    setCourses(db.getCourses());
  };

  const handleEdit = (course: Course) => {
    setFormData(course);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setFormData({ id: Date.now().toString(), courseName: '', credits: 3, department: '' });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveCourse(formData);
    setIsEditing(false);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure? This will delete associated enrollments.')) {
      db.deleteCourse(id);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Course Catalog</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Course</span>
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
           <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
             <h3 className="font-bold text-lg text-slate-800">{formData.id && courses.find(c => c.id === formData.id) ? 'Edit Course' : 'New Course'}</h3>
             <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
               <X size={20} />
             </button>
           </div>
           <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={formData.courseName}
                  onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Credits</label>
                    <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.credits}
                    onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <input
                    type="text"
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    />
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
                  <Check size={18} /> Save Course
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
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Code/ID</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Course Name</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Credits</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Department</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 text-slate-500 font-mono text-sm">{course.id}</td>
                  <td className="p-4 font-medium text-slate-800">{course.courseName}</td>
                  <td className="p-4 text-slate-600">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200">
                          {course.credits} Credits
                      </span>
                  </td>
                  <td className="p-4 text-slate-600">{course.department}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(course)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(course.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="opacity-20" />
                        <p>No courses found matching your search.</p>
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

export default Courses;