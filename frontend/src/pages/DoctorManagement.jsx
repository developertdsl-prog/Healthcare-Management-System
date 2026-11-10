import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Users2, Settings, TrendingUp, 
  Calendar, Shield, X, LogOut 
} from 'lucide-react';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    qualifications: '',
    consultationFee: '',
    departmentId: '',
    availability: 'available'
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const deptFilter = selectedDepartment ? `?departmentId=${selectedDepartment}` : '';
      const searchParams = search ? `&search=${search}` : '';
      const response = await fetch(`/api/doctors${deptFilter}${searchParams}`);
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/doctors/departments');
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this doctor?')) return;
    try {
      await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
      fetchDoctors();
    } catch (err) {
      console.error('Error deactivating doctor:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/doctors/${editingId}` : '/api/doctors';
      const headers = { 'Content-Type': 'application/json' };
      
      const body = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        specialization: formData.specialization,
        qualifications: formData.qualifications,
        consultationFee: parseFloat(formData.consultationFee) || 0,
        departmentId: formData.departmentId || null,
        availability: formData.availability
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchDoctors();
        setFormOpen(false);
        setFormData({
          firstName: '',
          lastName: '',
          specialization: '',
          qualifications: '',
          consultationFee: '',
          departmentId: '',
          availability: 'available'
        });
        setEditingId(null);
      } else {
        alert(data.message || 'Error saving doctor');
      }
    } catch (err) {
      console.error('Error saving doctor:', err);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-healthcare-dark mb-4">
          <Stethoscope className="mr-2 text-healthcare-accent"/>Doctor Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h4 className="text-healthcare-dark mb-3">Filters</h4>
            <div className="space-y-3">
              <div>
                <label className="text-healthcare-light/6 text-sm block mb-1">Department</label>
                <select 
                  value={selectedDepartment || ''}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
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
                  placeholder="Search by name, specialization..."
                  className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h4 className="text-healthcare-dark mb-3">Doctors List</h4>
            {loading ? (
              <p className="text-healthcare-light/6">Loading doctors...</p>
            ) : (
              <div className="h-96 overflow-y-auto">
                <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
                  <span className="text-healthcare-light flex-1">Name</span>
                  <span className="text-healthcare-light/6 text-sm">Specialization</span>
                  <span className="text-healthcare-light/6 text-sm">Fee</span>
                  <span className="text-healthcare-light/6 text-sm">Department</span>
                  <span className="text-healthcare-light/6 text-sm">Status</span>
                </div>
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
                    <span className="text-healthcare-light flex-1">{doctor.first_name} {doctor.last_name}</span>
                    <span className="text-healthcare-light/6 text-sm">{doctor.specialization || 'N/A'}</span>
                    <span className="text-healthcare-light/6 text-sm">₱{doctor.consultation_fee || 0}</span>
                    <span className="text-healthcare-light/6 text-sm">{doctor.department_name || 'General'}</span>
                    <span className="text-healthcare-light/6 text-sm">{doctor.availability}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">Add / Edit Doctor</h4>
        
        {editingId && (
          <p className="text-healthcare-light/6 mb-4">Editing doctor ID: {editingId}</p>
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
            <label className="text-healthcare-light/6 text-sm block mb-1">Specialization</label>
            <input 
              type="text" 
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g., Cardiology, Neurology, Pediatrics"
              required
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            />
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Qualifications</label>
            <textarea 
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              placeholder="e.g., MD, MRCS, FRCS, Subspecialty training..."
              rows={3}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent resize-none"
            /></div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Consultation Fee</label>
            <input 
              type="number" 
              value={formData.consultationFee}
              onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            />
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Department</label>
            <select 
              value={formData.departmentId || ''}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value || '' })}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Availability</label>
            <select 
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <button 
            type="submit"
            className={`w-full px-4 py-2 rounded bg-healthcare-accent text-white text-sm font-medium hover:bg-healthcare-accent/90 transition-colors ${editingId ? 'mb-2' : ''}`}
          >
            {editingId ? 'Update Doctor' : 'Add Doctor'}
          </button>
          <button 
            type="button"
            onClick={() => {
              setFormData({
                firstName: '',
                lastName: '',
                specialization: '',
                qualifications: '',
                consultationFee: '',
                departmentId: '',
                availability: 'available'
              });
              setEditingId(null);
              setFormOpen(false);
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

export default DoctorManagement;