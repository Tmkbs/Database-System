import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Student } from '../types';
import { Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Student>({ id: '', fullName: '', email: '', enrollmentDate: '' });

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    setFilteredStudents(
      students.filter(
        s =>
          s.fullName.toLowerCase().includes(lowerTerm) ||
          s.email.toLowerCase().includes(lowerTerm) ||
          s.id.includes(lowerTerm)
      )
    );
  }, [searchTerm, students]);

  const refreshData = () => {
    setStudents(db.getStudents());
  };

  const handleEdit = (student: Student) => {
    setFormData(student);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setFormData({ id: Date.now().toString(), fullName: '', email: '', enrollmentDate: new Date().toISOString().split('T')[0] });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveStudent(formData);
    setIsEditing(false);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure? This will delete associated enrollments.')) {
      db.deleteStudent(id);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Student Management</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Student</span>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-800">{formData.id && students.find(s => s.id === formData.id) ? 'Edit Student' : 'New Student'}</h3>
               <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
             </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Enrollment Date</label>
                  <input
                    type="date"
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.enrollmentDate}
                    onChange={e => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  />
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
                    <Check size={18} /> Save Student
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">ID</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Name</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Email</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Enrolled</th>
                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 text-slate-500 font-mono text-sm">#{student.id}</td>
                  <td className="p-4 font-medium text-slate-800">{student.fullName}</td>
                  <td className="p-4 text-slate-600">{student.email}</td>
                  <td className="p-4 text-slate-600">{student.enrollmentDate}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(student)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>No students found matching your search.</p>
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

export default Students;