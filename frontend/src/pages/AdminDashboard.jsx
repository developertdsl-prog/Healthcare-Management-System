import React, { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Users, Heart, Calendar, Stethoscope, Shield, FileText, Package, TrendingUp as TrendingUpIcon, Users as UsersIcon, Activity, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalStaff: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    totalRevenue: 0,
  });
  
  const [departments, setDepartments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch from our backend APIs
        const [statsResp, deptsResp, patientsResp, activitiesResp] = await Promise.all([
          fetch('/api/admin/dashboard/stats'),
          fetch('/api/admin/dashboard/departments'),
          fetch('/api/admin/dashboard/recent-patients'),
          fetch('/api/admin/dashboard/activities'),
        ]);

        if (!statsResp.ok) throw new Error('Failed to load stats');
        if (!deptsResp.ok) throw new Error('Failed to load departments');
        if (!patientsResp.ok) throw new Error('Failed to load patients');
        if (!activitiesResp.ok) throw new Error('Failed to load activities');

        const statsData = await statsResp.json();
        const deptsData = await deptsResp.json();
        const patientsData = await patientsResp.json();
        const activitiesData = await activitiesResp.json();

        setStats(statsData);
        setDepartments(deptsData);
        setRecentPatients(patientsData);
        setRecentActivities(activitiesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div class="flex justify-center items-h h-64">
          <div class="text-healthcare-light/6 animate-spin rounded-full border-4 border-healthcare-light/10 border-t-healthcare-accent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-healthcare-error text-white rounded-xl p-4 mb-4">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4l3 3"></path>
          </svg>
          <span>{error}</span>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-healthcare-light">
      <nav className="bg-white border-b border-healthcare-light/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-healthcare-dark">Admin Dashboard</h2>
            <button className="p-2 rounded hover:bg-healthcare-light/10 transition-colors" aria-label="Logout">
              <LogOut className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </nav>

      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Statistics Cards */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h3 className="text-healthcare-dark mb-4">Total Patients</h3>
            <p className="text-3xl font-bold text-healthcare-accent">{stats.totalPatients}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h3 className="text-healthcare-dark mb-4">Total Doctors</h3>
            <p className="text-3xl font-bold text-healthcare-accent">{stats.totalDoctors}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h3 className="text-healthcare-dark mb-4">Total Staff</h3>
            <p className="text-3xl font-bold text-healthware-accent">{stats.totalStaff}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h3 className="text-healthcare-dark mb-4">Total Appointments</h3>
            <p className="text-3xl font-bold text-healthcare-accent">{stats.totalAppointments}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h3 className="text-healthcare-dark mb-4">Today's Appointments</h3>
            <p className="text-3xl font-bold text-healthware-accent">{stats.todayAppointments}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h3 className="text-healthcare-dark mb-4">Total Revenue</h3>
            <p className="text-3xl font-bold text-healthcare-accent">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Department Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20 mb-8">
          <h3 className="text-healthcare-dark mb-4">Department Statistics</h3>
          <div className="space-y-3">
            {departments.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
                <span>{dept.name}</span>
                <span>{dept.count} {dept.type === 'doctor' ? 'Doctors' : 'Patients'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h4 className="text-healthcare-dark mb-4">Appointment Trends</h4>
            <div className="h-64 relative">
              {/* Chart placeholder - would use Recharts or similar */}
              <div className="h-full w-full bg-healthcare-light/10 rounded-t-lg overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 200 100">
                  <rect width="200" height="100" fill="none" stroke="heathcare-light/20" rx="5"/>
                  <polyline points="20,80 40,60 60,80 80,40 100,60 120,80 140,40 160,60 180,20" fill="none" stroke="heathcare-accent" strokeWidth="2"/>
                </svg>
              </div>
              <p className="text-healthcare-light/6 text-center absolute bottom-2 right-2">Last 30 Days</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h4 className="text-healthcare-dark mb-4">Revenue Trends</h4>
            <div className="h-64 relative">
              <div className="h-full w-full bg-healthcare-light/10 rounded-t-lg overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 200 100">
                  <rect width="200" height="100" fill="none" stroke="heathcare-light/20" rx="5"/>
                  <polyline points="20,60 40,40 60,80 80,40 100,60 120,40 140,80 160,40 180,20" fill="none" stroke="heathcare-accent" strokeWidth="2"/>
                </svg>
              </div>
              <p className="text-healthcare-light/6 text-center absolute bottom-2 right-2">This Month</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
          <h4 className="text-healthcare-dark mb-4">Recent Activities</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
                <span className="text-healthcare-light">{activity.description}</span>
                <span className="text-healthcare-light/6 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;