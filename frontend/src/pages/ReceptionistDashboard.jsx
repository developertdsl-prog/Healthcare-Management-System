import React from 'react';
import { Layout, Users2, Stethoscope, Calendar, Shield, FileText, Package, TrendingUp, Users as UsersIcon, Activity, LogOut } from 'lucide-react';

const ReceptionistDashboard = () => (
  <div className="p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-xl bg-healthcare-accent/10 flex items-center justify-center flex-shrink-0">
            <Layout className="w-6 h-6 text-healthcare-accent"/>
          </div>
          <div className="ml-4">
            <h3 className="text-semibold text-healthcare-dark">Total Patients</h3>
            <p className="text-3xl font-bold text-healthcare-accent">1,247</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-xl bg-healthcare-light/10 flex items-center justify-center flex-shrink-0">
            <Users2 className="w-6 h-6 text-healthcare-light"/>
          </div>
          <div className="ml-4">
            <h3 className="text-semibold text-healthcare-light">New Registrations</h3>
            <p className="text-3xl font-bold text-healthcare-light">23</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-xl bg-healthcare-light/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-healthcare-light"/>
          </div>
          <div className="ml-4">
            <h3 className="text-semibold text-healthcare-light">Appointments Today</h3>
            <p className="text-3xl font-bold text-healthcare-light">47</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">Today's Appointments</h4>
        <div className="h-96 overflow-y-auto">
          <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="w-10 rounded bg-healthcare-light/10 flex-shrink-0"></span>
            <span className="text-healthcare-light flex-1">9:00 AM - Dr. Smith</span>
          </div>
          <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="w-10 rounded bg-healthcare-light/10 flex-shrink-0"></span>
            <span className="text-healthcare-light flex-1">10:30 AM - Dr. Jones</span>
          </div>
          <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="w-10 rounded bg-healthcare-light/10 flex-shrink-0"></span>
            <span className="text-healthcare-light flex-1">2:00 PM - Dr. Williams</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">Waiting List</h4>
        <div className="h-64 overflow-y-auto">
          <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="text-healthcare-light/6 text-sm">1. Mrs. Davis</span>
          </div>
          <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="text-healthcare-light/6 text-sm">2. Mr. Thompson</span>
          </div>
          <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="text-healthcare-light/6 text-sm">3. Ms. Wilson</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
      <h4 className="text-healthcare-dark mb-4">Quick Actions</h4>
      <div className="grid grid-cols-2 gap-3">
        <button className="px-4 py-2 rounded bg-healthcare-accent text-white text-sm font-medium hover:bg-healthcare-accent/90 transition-colors">
          Register New Patient
        </button>
        <button className="px-4 py-2 rounded bg-healthcare-light/10 text-healthcare-dark text-sm font-medium hover:bg-healthcare-light/20 transition-colors">
          Schedule Appointment
        </button>
        <button className="px-4 py-2 rounded bg-healthcare-light/10 text-healthcare-dark text-sm font-medium hover:bg-healthcare-light/20 transition-colors">
          View Patient Records
        </button>
        <button className="px-4 py-2 rounded bg-healthcare-light/10 text-healthcare-dark text-sm font-medium hover:bg-healthcare-light/20 transition-colors">
          Generate Report
        </button>
      </div>
    </div>
  </div>
);

export default ReceptionistDashboard;