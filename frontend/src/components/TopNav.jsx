import React from 'react';
import { Menu, Settings, Users, Layout, Users2, Stethoscope, Users as UsersIcon, Users as UsersMultiple, Building2, Heart, Shield, Folder, LogOut, FileText, Package, Heartbeat, Clipboard, BarChart2, TrendingUp, Activity, LogOut as LogOutIcon } from 'lucide-react';

const healthcareColors = {
  dark: '#1e293b',
  lighter: '#0f172a',
  accent: '#3b82f6',
  light: '#f1f5f9',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const Sidebar = ({ 
  isOpen, 
  setIsOpen, 
  currentPage,
  setCurrentPage 
}) => (
  <aside className={`fixed left-0 top-0 h-full w-64 bg-healthcare-darker transition-transform duration-300 ${isOpen ? 'transform translateX(0)' : 'transform translate-x-full'}`}>
    <div className="flex h-14 items-center justify-between px-4">
      <h2 className="text-xl font-bold text-healthcare-accent">HealthCare</h2>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded hover:bg-healthcare-accent/20 transition-colors"
        aria-label="Toggle navigation"
      >
        <Menu className="w-6 h-6"/>
      </button>
    </div>
    <nav className="flex flex-col pt-6 space-y-2 px-2">
      <button 
        onClick={() => setCurrentPage('dashboard')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 'dashboard' ? 'bg-healthcare-accent text-white' : 'text-healthcare-light hover:bg-healthcare-light/10 transition-colors'
        }`}
        aria-current="page"
      >
        <Layout className="w-5 h-5 mr-2"/>
        Dashboard
      </button>
      <button 
        onClick={() => setCurrentPage('patients')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 'patients' ? 'bg-healthcare-accent text-white' : 'text-healthcare-light hover:bg-healthcare-light/10 transition-colors'
        }`}
      >
        <Users2 className="w-5 h-5 mr-2"/>
        Patients
      </button>
      <button 
        onClick={() => setCurrentPage('doctors')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 'doctors' ? 'bg-healthcare-accent text-white' : 'text-healthcare-light hover:bg-healthcare-light/10 transition-colors'
        }`}
      >
        <Stethoscope className="w-5 h-5 mr-2"/>
        Doctors
      </button>
      <button 
        onClick={() => setCurrentPage('doctor-management')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 'doctor-management' ? 'bg-healthcare-accent text-white' : 'text-healthcare-light hover:bg-healthcare-light/10 transition-colors'
        }`}
      >
        <UsersIcon className="w-5 h-5 mr-2"/>
        Doctor Mgmt
      </button>
      <button 
        onClick={() => setCurrentPage('staff-management')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 'staff-management' ? 'bg-healthcare-accent text-white' : 'text-healthcare-light hover:bg-healthcare-light/10 transition-colors'
        }`}
      >
        <UsersMultiple className="w-5 h-5 mr-2"/>
        Staff Mgmt
      </button>
      <button 
        onClick={() => setCurrentPage('appointments')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 'appointments' ? 'bg-healthcare-accent text-white' : 'text-healthcare-light hover:bg-healthcare-light/10 transition-colors'
        }`}
      >
        <Calendar className="w-5 h-5 mr-2"/>
        Appointments
      </button>
      <button 
        onClick={() => setCurrentPage('records')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 'records' ? 'bg-healthcare-accent text-white' : 'text-healthcare-light hover:bg-healthcare-light/10 transition-colors'
        }`}
      >
        <FileText className="w-5 h-5 mr-2"/>
        Records
      </button>
      <button 
        onClick={() => setCurrentPage('billing')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 'billing' ? 'bg-healthcare-accent text-white' : 'text-healthcare-light hover:bg-healthcare-light/10 transition-colors'
        }`}
      >
        <TrendingUp className="w-5 h-5 mr-2"/>
        Billing
      </button>
    </nav>
    <div className="flex items-center justify-center py-6 text-sm text-healthcare-light/6">
      Version 1.0.0
    </div>
  </aside>
);

export const TopNav = ({ 
  isOpen, 
  setIsOpen,
  currentPage,
  setCurrentPage 
}) => (
  <header className="fixed top-0 left-64 right-0 h-14 bg-white border-b border-healthcare-light/20 z-50 transition-transform duration-300 ${isOpen ? 'left-64' : 'left-0'}" aria-label="Top navigation">
    <div className="flex items-center justify-between max-w-7xl mx-6 px-4">
      <h1 className="text-xl font-bold text-healthcare-dark">HealthCare Management</h1>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded hover:bg-healthcare-light/10 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5"/>
        </button>
        <div className="relative">
          <svg className="w-6 h-6 text-healthcare-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.3-4.3"></path>
          </svg>
          <span className="absolute -top-1 -right-1 bg-healthcare-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
        </div>
      </div>
    </div>
  </header>
);

export const DashboardLayout = ({ 
  children,
  pageTitle,
  currentPage,
  setCurrentPage 
}) => (
  <div className="relative min-h-screen">
    <Sidebar 
      isOpen={!!currentPage} 
      setIsOpen={() => {}}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
    <TopNav 
      isOpen={!!currentPage} 
      setIsOpen={() => {}}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
    <main className="ml-64 p-6 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-healthcare-dark">{pageTitle}</h2>
      </div>
      {children}
    </main>
  </div>
);