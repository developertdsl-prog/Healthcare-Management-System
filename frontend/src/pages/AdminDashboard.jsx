import React from 'react';
import { BarChart2, TrendingUp, Users, Heart, Calendar, Stethoscope, Shield, Folder, FileText, Package, Activity } from 'lucide-react';

const AdminDashboard = () => (
  <div className="p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-xl bg-healthcare-accent/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-healthcare-accent"/>
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
            <Stethoscope className="w-6 h-6 text-healthcare-light"/>
          </div>
          <div className="ml-4">
            <h3 className="text-semibold text-healthcare-light">Total Doctors</h3>
            <p className="text-3xl font-bold text-healthcare-light">156</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-xl bg-healthcare-light/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-healthcare-light/6"/>
          </div>
          <div className="ml-4">
            <h3 className="text-semibold text-healthcare-light">Total Appointments</h3>
            <p className="text-3xl font-bold text-healthcare-light">3,982</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">Recent Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="text-healthcare-light">Dr. Smith registered</span>
            <span className="text-healthcare-light/6 text-sm">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="text-healthcare-light">New patient registration</span>
            <span className="text-healthcare-light/6 text-sm">Yesterday</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="text-healthcare-light">Appointment updated</span>
            <span className="text-healthcare-light/6 text-sm">3 days ago</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">Statistics</h4>
        <div className="flex flex-col sm:flex-row justify-between items-start items-sm-end gap-4">
          <div>
            <p className="text-healthcare-light/6">Revenue this month</p>
            <p className="text-2xl font-bold text-healthcare-accent">$45,230</p>
          </div>
          <div>
            <p className="text-healthcare-light/6">Appointments today</p>
            <p className="text-2xl font-bold text-healthcare-accent">47</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
      <h4 className="text-healthcare-dark mb-4">System Status</h4>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-healthcare-success"></div>
          <span className="text-healthcare-light">Online</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-healthcare-warning"></div>
          <span className="text-healthcare-light">Warning</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-healthcare-error"></div>
          <span className="text-healthcare-light">Attention</span>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;