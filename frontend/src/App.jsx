import React, { useState } from 'react';
import { Sidebar, TopNav, DashboardLayout, Navigation } from './components';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import PatientDashboard from './pages/PatientDashboard';
import DoctorManagement from './pages/DoctorManagement';
import StaffManagement from './pages/StaffManagement';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pages = {
    dashboard: <AdminDashboard key="dashboard" />,
    doctors: <DoctorDashboard key="doctors" />,
    patients: <PatientDashboard key="patients" />,
    receptionist: <ReceptionistDashboard key="receptionist" />,
    doctor-management: <DoctorManagement key="doctor-management" />,
    staff-management: <StaffManagement key="staff-management" />,
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