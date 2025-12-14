import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, GraduationCap, Code, Database, AlertCircle } from 'lucide-react';
import { db } from '../services/db';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ students: 0, courses: 0, enrollments: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching real-time data
    const students = db.getStudents();
    const courses = db.getCourses();
    const enrollments = db.getEnrollments();

    setStats({
      students: students.length,
      courses: courses.length,
      enrollments: enrollments.length,
    });

    // Prepare chart data: Enrollments per course
    const data = courses.map(course => {
      const count = enrollments.filter(e => e.courseId === course.id).length;
      return {
        name: course.courseName,
        students: count,
      };
    });
    setChartData(data);
  }, []);

  return (
    <div className="space-y-6">
      {/* Assignment Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-4 shadow-sm">
        <div className="bg-yellow-100 p-3 rounded-full text-yellow-700 mt-1">
            <AlertCircle size={24} />
        </div>
        <div>
            <h3 className="text-lg font-bold text-yellow-900">Project Source Code Available</h3>
            <p className="text-yellow-800 mt-1">
                You are currently viewing the <strong>Web Demo</strong>. 
                Per your assignment requirements, the <strong>Python (Tkinter)</strong> source code and <strong>MySQL Schema</strong> have been generated for you.
            </p>
            <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-yellow-200 text-sm font-mono text-slate-700">
                    <Code size={16} /> desktop_app.py
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-yellow-200 text-sm font-mono text-slate-700">
                    <Database size={16} /> schema.sql
                </div>
            </div>
            <p className="text-sm text-yellow-700 mt-3">
                Download these files from the file explorer to run them on your local machine with Python & MySQL.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.students}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Courses</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.courses}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Enrollments</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.enrollments}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Course Popularity (Live Data)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;