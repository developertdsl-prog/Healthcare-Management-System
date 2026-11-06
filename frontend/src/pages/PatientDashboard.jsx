import React from 'react';
import { Layout, Users2, Stethoscope, Calendar, Shield, FileText, Package, TrendingUp, Users as UsersIcon, Activity } from 'lucide-react';

const PatientDashboard = () => (
  <div className="p-8">
    <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
      <h2 className="text-2xl font-bold text-healthcare-dark mb-4">Welcome</h2>
      <p className="text-healthcare-light/6 mb-6">Your personal health management portal</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-healthcare-accent/10 flex items-center justify-center flex-shrink-0">
            <UsersIcon className="w-5 h-5 text-healthcare-accent"/>
          </div>
          <div>
            <p className="text-healthcare-dark">My Profile</p>
            <p className="text-healthcare-light/6 small">View and update your information</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-healthcare-light/10 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-healthcare-light"/>
          </div>
          <div>
            <p className="text-healthcare-dark">Medical History</p>
            <p className="text-healthcare-light/6 small">Your past visits and diagnoses</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-healthcare-light/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-healthcare-light/6"/>
          </div>
          <div>
            <p className="text-healthcare-dark">Appointments</p>
            <p className="text-healthcare-light/6 small">Upcoming and past appointments</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-healthcare-light/10 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-healthcare-light"/>
          </div>
          <div>
            <p className="text-healthcare-dark">Prescriptions</p>
            <p className="text-healthcare-light/6 small">Current and past prescriptions</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">Upcoming Appointments</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
            <span>May 15, 2024</span>
            <span className="text-healthcare-light/6">Dr. Smith</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
            <span>May 20, 2024</span>
            <span className="text-healthcare-light/6">Dr. Jones</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">Recent Visits</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
            <span>April 28, 2024</span>
            <span className="text-healthcare-light/6">General Checkup</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
            <span>April 15, 2024</span>
            <span className="text-healthcare-light/6">Vaccination</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
      <h4 className="text-healthcare-dark mb-4">Health Tips</h4>
      <p className="text-healthcare-light/6 mb-4">Stay hydrated and aim for 8 glasses of water daily.</p>
      <div className="flex items-start">
        <svg className="w-5 h-5 flex-sr-0 text-healthcare-success mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.94-9.14"></path>
          <polyline points="22 4 12 14 9 10.5"></polyline>
        </svg>
        <span className="ml-3 text-healthcare-light">Regular exercise improves cardiovascular health</span>
      </div>
      <div className="flex items-start mt-4">
        <svg className="w-5 h-5 flex-sr-0 text-healthcare-success mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.94-9.14"></path>
          <polyline points="22 4 12 14 9 10.5"></polyline>
        </svg>
        <span className="ml-3 text-healthcare-light">Eat at least 5 servings of fruits and vegetables daily</span>
      </div>
    </div>
  </div>
);

export default PatientDashboard;