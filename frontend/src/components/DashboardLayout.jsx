import React from 'react';
import { Sidebar, TopNav, DashboardLayout } from './components';

const Page = ({ children }) => {
  return (
    <div className="min-h-screen bg-healthcare-light">
      <Sidebar isOpen={true} setIsOpen={() => {}} currentPage="dashboard" setCurrentPage={() => {}} />
      <TopNav isOpen={true} setIsOpen={() => {}} currentPage="dashboard" setCurrentPage={() => {}} />
      <main className="ml-64 p-6 flex-1">
        <h2 className="text-2xl font-bold text-healthcare-dark">HealthCare Management System</h2>
        <p className="text-healthcare-light/6 mb-6">Professional healthcare management platform</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Page;