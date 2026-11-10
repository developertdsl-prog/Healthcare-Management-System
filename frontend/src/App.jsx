import React, { useState } from 'react';
import { Sidebar, TopNav, DashboardLayout, Navigation } from './components';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import PatientDashboard from './pages/PatientDashboard';
import MedicalRecords from './pages/MedicalRecords';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pages = {
    dashboard: <AdminDashboard key="dashboard" />,
    doctors: <DoctorDashboard key="doctors" />,
    patients: <PatientDashboard key="patients" />,
    receptionist: <ReceptionistDashboard key="receptionist" />,
    'medical-records': <MedicalRecords key="medical-records" />,
  };

  return (
    <div className="min-h-screen">
      <TopNav 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
      />
      <DashboardLayout 
        children={pages[currentPage] || pages.dashboard}
        pageTitle={currentPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default App;