import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users2, Stethoscope, CheckCircle, XCircle, 
  Loader2, TrendingUp, Clock, Mail, Flag, 
  Heart, Clipboard, CalendarDays, Plus 
} from 'lucide-react';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    departmentId: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    status: 'scheduled',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [search, statusFilter]);

  const fetchAppointments = async () => {
    try {
      let url = '/api/appointments';
      const params = [];
      const conditions = [];
      
      if (search) {
        conditions.push('(p.name LIKE ? OR d.first_name LIKE ? OR a.id LIKE ?)');
      }
      if (statusFilter && statusFilter !== 'all') {
        conditions.push('a.status = ?');
      }
      
      if (conditions.length > 0) {
        url += ' WHERE ' + conditions.join(' AND ');
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setAppointments(data.appointments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      fetchAppointments();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatusMap = {
      'scheduled': 'approved',
      'approved': 'completed',
      'completed': 'cancelled',
      'cancelled': 'scheduled'
    };
    const newStatus = newStatusMap[currentStatus] || 'approved';
    
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAppointments();
    } catch (err) {
      console.error('Error updating appointment status:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/appointments/${editingId}` : '/api/appointments';
      const headers = { 'Content-Type': 'application/json' };
      
      const body = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        departmentId: formData.departmentId,
        date: formData.date,
        timeSlot: formData.timeSlot,
        status: formData.status,
        notes: formData.notes
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchAppointments();
        setFormOpen(false);
        setFormData({
          patientId: '',
          doctorId: '',
          departmentId: '',
          date: new Date().toISOString().split('T')[0],
          timeSlot: '',
          status: 'scheduled',
          notes: ''
        });
        setEditingId(null);
      } else {
        alert(data.message || 'Error saving appointment');
      }
    } catch (err) {
      console.error('Error saving appointment:', err);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-healthcare-dark mb-4">
          <Calendar className="mr-2 text-healthcare-accent"/>Appointment Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h4 className="text-healthcare-dark mb-3">Filters</h4>
            <div className="space-y-3">
              <div>
                <label className="text-healthcare-light/6 text-sm block mb-1">Status</label>
                <select 
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value === 'all' ? '' : e.target.value)}
                  className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                >
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-healthcare-light/6 text-sm block mb-1">Search</label>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by patient, doctor, or appointment ID..."
                  className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
            <h4 className="text-healthcare-dark mb-3">Appointments List</h4>
            {loading ? (
              <p className="text-healthcare-light/6">Loading appointments...</p>
            ) : (
              <div className="h-96 overflow-y-auto">
                <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
                  <span className="text-healthcare-light flex-1">Patient</span>
                  <span className="text-healthcare-light/6 text-sm">Doctor</span>
                  <span className="text-healthcare-light/6 text-sm">Date</span>
                  <span className="text-healthcare-light/6 text-sm">Time</span>
                  <span className="text-healthcare-light/6 text-sm">Status</span>
                  <span className="text-healthcare-light/6 text-sm">Actions</span>
                </div>
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
                    <span className="text-healthcare-light flex-1">{apt.patient_name || 'Unknown'}</span>
                    <span className="text-healthcare-light/6 text-sm">{apt.doctor_first_name || 'Unknown'} {apt.doctor_last_name || ''}</span>
                    <span className="text-healthcare-light/6 text-sm">{apt.date}</span>
                    <span className="text-healthcare-light/6 text-sm">{apt.time_slot || 'N/A'}</span>
                    <span className="text-healthcare-light/6 text-sm">{apt.status}</span>
                    <div className="flex space-x-2">
                      {apt.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusUpdate(apt.id, apt.status)}
                          className="px-2 py-1 rounded text-xs text-healthcare-accent hover:text-white transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {apt.status === 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(apt.id, apt.status)}
                          className="px-2 py-1 rounded text-xs text-healthcare-light/6 hover:bg-healthcare-light/20 transition-colors"
                        >
                          Complete
                        </button>
                      )}
      {apt.status === 'completed' || apt.status === 'cancelled' && (
                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="px-2 py-1 rounded text-xs text-healthcare-error hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">
          {editingId ? 'Edit Appointment' : 'Book New Appointment'}
          {editingId && <span className="text-healthcare-light/6 ml-2">ID: {editingId}</span>}
        </h4>
        
        {editingId && (
          <p className="text-healthcare-light/6 mb-4">Updating appointment ID: {editingId}</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Patient</label>
            <select 
              value={formData.patientId || ''}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            >
              <option value="">Select Patient</option>
              {/* Patient options would be populated dynamically */}
            </select>
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Doctor</label>
            <select 
              value={formData.doctorId || ''}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            >
              <option value="">Select Doctor</option>
              {/* Doctor options would be populated dynamically */}
            </select>
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Department</label>
            <select 
              value={formData.departmentId || ''}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            >
              <option value="">Select Department</option>
              {/* Department options would be populated dynamically */}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-healthcare-light/6 text-sm block mb-1">Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
              />
            </div>
            <div>
              <label className="text-healthcare-light/6 text-sm block mb-1">Time Slot</label>
              <input 
                type="text" 
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                placeholder="e.g., 9:00 AM"
                className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
              />
            </div>
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
            >
              <option value="scheduled">Scheduled</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="text-healthcare-light/6 text-sm block mb-1">Notes</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Appointment notes..."
              rows={3}
              className="w-full px-3 py-2 rounded border border-healthcare-light/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent resize-none"
            /></div>
          <button 
            type="submit"
            className={`w-full px-4 py-2 rounded bg-healthcare-accent text-white text-sm font-medium hover:bg-healthcare-accent/90 transition-colors ${editingId ? 'mb-2' : ''}`}
          >
            {editingId ? 'Update Appointment' : 'Book Appointment'}
          </button>
          <button 
            type="button"
            onClick={() => {
              setFormData({
                patientId: '',
                doctorId: '',
                departmentId: '',
                date: new Date().toISOString().split('T')[0],
                timeSlot: '',
                status: 'scheduled',
                notes: ''
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

export default AppointmentManagement;