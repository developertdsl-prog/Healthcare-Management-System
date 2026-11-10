import React, { useState } from 'react';
import { 
  Layout, Users2, Stethoscope, Calendar, Shield, FileText, Package, 
  TrendingUp, Users as UsersIcon, Activity, LogOut, 
  Home, Settings, User, Mail, Heart, Clipboard, CalendarDays 
} from 'lucide-react';

const NavItem = ({ 
  label, 
  icon, 
  href,
  onSelect,
  currentPage,
  setCurrentPage
}) => {
  const isActive = currentPage === label || (href && window.location.pathname.includes(href));
  
  return (
    <button 
      onClick={() => onSelect ? onSelect(label) : window.location.href = href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? 'bg-healthcare-accent text-white' : 'text-healthcare-light hover:bg-healthcare-light/10 transition-colors'
      } ${currentPage === label ? 'font-semibold' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <icon className="w-5 h-5 mr-2"/>
      <span>{label}</span>
    </button>
  );
};

export const Navigation = ({ currentPage, setCurrentPage }) => (
  <nav className="flex gap-2 px-6 py-2 bg-healthcare-light/50 rounded-full">
    <NavItem 
      label="Dashboard" 
      icon={Home} 
      onSelect={(page) => setCurrentPage('dashboard')} 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
    />
    <NavItem 
      label="Patients" 
      icon={Users2} 
      onSelect={(page) => setCurrentPage('patients')} 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
    />
    <NavItem 
      label="Doctors" 
      icon={Stethoscope} 
      onSelect={(page) => setCurrentPage('doctors')} 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
    />
    <NavItem 
      label="Appointments" 
      icon={CalendarDays} 
      onSelect={(page) => setCurrentPage('appointment-management')} 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
    />
    <NavItem 
      label="Records" 
      icon={Shield} 
      onSelect={(page) => setCurrentPage('records')} 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
    />
    <NavItem 
      label="Billing" 
      icon={TrendingUp} 
      onSelect={(page) => setCurrentPage('billing')} 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
    />
  </nav>
);

export default Navigation;