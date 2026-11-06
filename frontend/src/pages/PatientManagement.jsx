import React, { useState, useEffect } from 'react';
import { Users2, Calendar, Shield, Package, TrendingUp, Users as UsersIcon, LogOut } from 'lucide-react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    bloodGroup: '',
    allergies: '',
    phone: '',
    address: ''
  });

  // Fetch patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const search = searchTerm.trim() || '';
        const bloodGroupFilter = filterBloodGroup || '';
        const statusFilter = filterStatus || '';
        
        let url = '/api/patients';
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (bloodGroupFilter) params.append('bloodGroup', bloodGroupFilter);
        if (statusFilter) params.append('status', statusFilter);
        if (params.toString()) url += '?' + params.toString();
        
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('Failed to load patients');
        
        const data = await resp.json();
        setPatients(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatients();
  }, [searchTerm, filterBloodGroup, filterStatus]);

  // Add new patient
  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient)
      });
      
      if (!resp.ok) throw new Error('Failed to add patient');
      
      setShowAddPatient(false);
      setNewPatient({ name: '', bloodGroup: '', allergies: '', phone: '', address: '' });
      fetchPatients(); // Refresh list
    } catch (err) {
      console.error('Error adding patient:', err);
    }
  };

  // Delete patient
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this patient?')) return;
    try {
      const resp = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error('Failed to deactivate patient');
      fetchPatients();
    } catch (err) {
      console.error('Error deleting patient:', err);
    }
  };

  // Filter change handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleBloodGroupChange = (e) => {
    setFilterBloodGroup(e.target.value);
  };
  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-h h-64">
          <div className="text-healthcare-light/6 animate-spin rounded-full border-4 border-healthcare-light/10 border-t-healthcare-accent"></div>
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
  }

  // Filtered patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = !filterBloodGroup || patient.bloodGroup === filterBloodGroup;
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesBloodGroup && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-healthcare-light">
      <nav className="bg-white border-b border-healthcare-light/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-healthcare-dark">Patient Management</h2>
            <button className="p-2 rounded hover:bg-healthcare-light/10 transition-colors" onClick={() => setShowAddPatient(true)} aria-label="Add New Patient">
              <UsersIcon className="w-5 h-5 mr-1"/> Add Patient
            </button>
          </div>
        </div>
      </nav>

      <main className="p-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-healthcare-dark text-sm mb-1">Search</label>
              <input 
                type="text" 
                value={searchTerm} 
                onChange={handleSearchChange} 
                placeholder="Search by name or ID..."
                className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                aria-label="Search patients"
              />
            </div>
            <div>
              <label className="block text-healthcare-dark text-sm mb-1">Blood Group</label>
              <select 
                value={filterBloodGroup} 
                onChange={handleBloodGroupChange} 
                className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                aria-label="Filter by blood group"
              >
                <option value="">All Blood Groups</option>
                <option value='A+'>A+</option>
                <option value='A-'>A-</option>
                <option value='B+'>B+</option>
                <option value='B-'>B-</option>
                <option value='AB+'>AB+</option>
                <option value='AB-'>AB-</option>
                <option value='O+'>O+</option>
                <option value='O-'>O-</option>
              </select>
            </div>
            <div>
              <label className="block text-healthcare-dark text-sm mb-1">Status</label>
              <select 
                value={filterStatus} 
                onChange={handleStatusChange} 
                className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                aria-label="Filter by status"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-healthcare-light border-b border-healthcare-light/10">
                  <th className="text-left p-3 text-healthcare-light/6">Patient ID</th>
                  <th className="text-left p-3 text-healthcare-light/6">Name</th>
                  <th className="text-left p-3 text-healthcare-light/6">Blood Group</th>
                  <th className="text-left p-3 text-healthcare-light/6">Phone</th>
                  <th className="text-left p-3 text-healthcare-light/6">Last Visit</th>
                  <th className="text-left p-3 text-healthcare-light/6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-healthcare-light/6 py-8">No patients found</td>
                  </tr>
                ) : (
                  filteredPatients.map(patient => (
                    <tr key={patient.id} className="border-b border-healthcare-light/10">
                      <td className="text-healthcare-light/6 p-3">{patient.id}</td>
                      <td className="text-healthcare-light p-3">{patient.name}</td>
                      <td className="text-healthcare-light/6 p-3">
                        <span className="badge bg-healthcare-light/10 text-healthcare-light px-2 py-1 rounded">
                          {patient.bloodGroup}
                        </span>
                      </td>
                      <td className="text-healthcare-light/6 p-3">{patient.phone || 'N/A'}</td>
                      <td className="text-healthcare-light/6 p-3">{patient.lastVisit || 'Never'}</td>
                      <td className="text-healthcare-light/6 p-3">
                        <button 
                          onClick={() => handleDelete(patient.id)}
                          className="text-healthcare-light/6 hover:text-healthcare-error transition-colors"
                          aria-label="Deactivate patient"
                        >
                          <Shield className="w-4 h-4 mr-1"/> Deactivate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Patient Modal */}
        {showAddPatient && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-healthcare-dark mb-6 text-center">Add New Patient</h3>
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div>
                  <label className="block text-healthcare-dark text-sm mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={newPatient.name} 
                    onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} 
                    placeholder="Enter patient full name" 
                    required
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                  />
                </div>
                <div>
                  <label className="block text-healthcare-dark text-sm mb-1">Blood Group</label>
                  <select 
                    value={newPatient.bloodGroup} 
                    onChange={(e) => setNewPatient({...newPatient, bloodGroup: e.target.value})}
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                  >
                    <option value="">Select blood group</option>
                    <option value='A+'>A+</option>
                    <option value='A-'>A-</option>
                    <option value='B+'>B+</option>
                    <option value='B-'>B-</option>
                    <option value='AB+'>AB+</option>
                    <option value='AB-'>AB-</option>
                    <option value='O+'>O+</option>
                    <option value='O-'>O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-healthcare-dark text-sm mb-1">Allergies</label>
                  <input 
                    type="text" 
                    value={newPatient.allergies} 
                    onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})} 
                    placeholder="e.g. Penicillin, Peanuts" 
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                  />
                </div>
                <div>
                  <label className="block text-healthcare-dark text-sm mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={newPatient.phone} 
                    onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})} 
                    placeholder="+1 (555) 123-4567" 
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                  />
                </div>
                <div>
                  <label className="block text-healthcare-dark text-sm mb-1">Address</label>
                  <input 
                    type="text" 
                    value={newPatient.address} 
                    onChange={(e) => setNewPatient({...newPatient, address: e.target.value})} 
                    placeholder="Patient address" 
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-healthcare-accent"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowAddPatient(false)} className="px-4 py-2 rounded bg-healthcare-light/10 text-healthcare-dark hover:bg-healthcare-light/20 transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-healthcare-accent text-white hover:bg-healthcare-accent/90 transition-colors">Add Patient</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientManagement;