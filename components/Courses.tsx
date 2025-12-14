import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Course } from '../types';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Course>({ id: '', courseName: '', credits: 0, department: '' });

  useEffect(() => {
    refreshData();
  }, []);

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Course Catalog</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Course
        </button>
      </div>

      {isEditing && (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-inner">
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.courseName}
                  onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Credits</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.credits}
                  onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div className="md:col-span-3 flex justify-end gap-3 mt-2">
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
              <th className="p-4 font-semibold text-slate-600">Code/ID</th>
              <th className="p-4 font-semibold text-slate-600">Course Name</th>
              <th className="p-4 font-semibold text-slate-600">Credits</th>
              <th className="p-4 font-semibold text-slate-600">Department</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-500 font-mono text-sm">{course.id}</td>
                <td className="p-4 font-medium text-slate-800">{course.courseName}</td>
                <td className="p-4 text-slate-600">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                        {course.credits} Credits
                    </span>
                </td>
                <td className="p-4 text-slate-600">{course.department}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(course)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">No courses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;