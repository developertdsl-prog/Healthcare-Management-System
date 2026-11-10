import React, { useState, useEffect } from 'react';
import { 
  Users2, UserCheck, Users, Settings, TrendingUp, 
  Calendar, Shield, X, LogOut 
} from 'lucide-react';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState(['doctor', 'nurse', 'technician', 'admin', 'receptionist']);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: 'receptionist',
    specialization: '',
    hireDate: '',
    status: 'active'
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/doctors/staff');
      const data = await response.json();
      setStaff(data);
    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this staff member?')) return;
    try {
      await fetch(`/api/doctors/staff/${id}`, { method: 'DELETE' });
      fetchStaff();
    } catch (err) {
      console.error('Error deactivating staff:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/doctors/staff/${editingId}` : '/api/doctors/staff';
      const headers = { 'Content-Type': 'application/json' };
      
      const body = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        specialization: formData.specialization,
        hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
        status: formData.status
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchStaff();
        setFormOpen(false);
        setFormData({
          firstName: '',
          lastName: '',
          role: 'receptionist',
          specialization: '',
          hireDate: '',
          status: 'active'
        });
        setEditingId(null);
      } else {
        alert(data.message || 'Error saving staff');
      }
    } catch (err) {
      console.error('Error saving staff:', err);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-healthcare-dark mb-4">
          <Users2 className="mr-2 text-healthcare-accent"/>Staff Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h4 className="text-healthcare-dark mb-3">Filters</h4>
            <div className="space-y-3">
              <div>
                <label className="text-healthcare-light/6 text-sm block mb-1">Role</label>
                <select 
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                >
                  <option value="">All Roles</option>
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-healthcare-light/6 text-sm block mb-1">Search</label>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h4 className="text-healthcare-dark mb-3">Staff List</h4>
            {loading ? (
              <p className="text-healthcare-light/6">Loading staff...</p>
            ) : (
              <div className="h-96 overflow-y-auto">
                <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
                  <span className="text-healthcare-light flex-1">Name</span>
                  <span className="text-healthcare-light/6 text-sm">Role</span>
                  <span className="text-healthcare-light/6 text-sm">Specialization</span>
                  <span className="text-healthcare-light/6 text-sm">Hire Date</span>
                </div>
                {staff.map((s) => (
                  <div key={s.id} className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
                    <span className="text-healthcare-light flex-1">{s.first_name} {s.last_name}</span>
                    <span className="text-healthcare-light/6 text-sm">{s.role.charAt(0).toUpperCase() + s.role.slice(1)}</span>
                    <span className="text-healthcare-light/6 text-sm">{s.specialization || 'N/A'}</span>
                    <span className="text-healthcare-light/6 text-sm">{s.hire_date || 'N/A'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">Add / Edit Staff</h4>
        
        {editingId && (
          <p className="text-healthcare-light/6 mb-4">Editing staff ID: {editingId}</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">First Name</label>
            <input 
              type="text" 
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Enter first name"
              required
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            />
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Last Name</label>
            <input 
              type="text" 
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Enter last name"
              required
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            />
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Role</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="technician">Technician</option>
              <option value="admin">Admin</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Specialization</label>
            <input 
              type="text" 
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g., Emergency, Pediatrics, Administration..."
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            />
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Hire Date</label>
            <input 
              type="date" 
              value={formData.hireDate}
              onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            />
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button 
            type="submit"
            className={`w-full px-4 py-2 rounded bg-healthcare-accent text-white text-sm font-medium hover:bg-healthcare-accent/90 transition-colors ${editingId ? 'mb-2' : ''}`}
          >
            {editingId ? 'Update Staff' : 'Add Staff'}
          </button>
          <button 
            type="button"
            onClick={() => {
              setFormData({
                firstName: '',
                lastName: '',
                role: 'receptionist',
                specialization: '',
                hireDate: '',
                status: 'active'
              });
              setEditingId(null);
            }}
            className="w-full px-4 py-2 rounded bg-healthcare-light/10 text-healthcare-dark text-sm font-medium hover:bg-healthcare-light/20 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffManagement;