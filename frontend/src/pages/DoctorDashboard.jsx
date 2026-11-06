import React from 'react';
import { BarChart2, TrendingUp, Users, Heart, Calendar, Stethoscope, Shield, Folder, FileText, Package, Activity } from 'lucide-react';

const DoctorDashboard = () => (
  <div className="p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-xl bg-healthcare-accent/10 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-healthcare-accent"/>
          </div>
          <div className="ml-4">
            <h3 className="text-semibold text-healthcare-dark">Total Patients</h3>
            <p className="text-3xl font-bold text-healthcare-accent">892</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-xl bg-healthcare-light/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-healthcare-light"/>
          </div>
          <div className="ml-4">
            <h3 className="text-semibold text-healthcare-light">Today's Appointments</h3>
            <p className="text-3xl font-bold text-healthcare-light">12</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-xl bg-healthcare-light/10 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-healthcare-light"/>
          </div>
          <div className="ml-4">
            <h3 className="text-semibold text-healthcare-light">Consultations this month</h3>
            <p className="text-3xl font-bold text-healthcare-light">342</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">Patient List</h4>
        <div className="h-96 overflow-y-auto">
          <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="text-healthcare-light flex-1">Patient Name</span>
            <span className="text-healthcare-light/6 text-sm">ID</span>
          </div>
          <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="text-healthcare-light flex-1">John Doe</span>
            <span className="text-healthcare-light/6 text-sm">P001</span>
          </div>
          <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="text-healthcare-light flex-1">Jane Smith</span>
            <span className="text-healthcare-light/6 text-sm">P002</span>
          </div>
          <div className="flex items-center px-3 py-2 border-b border-healthcare-light/10 last:border-0">
            <span className="text-healthcare-light flex-1">Bob Johnson</span>
            <span className="text-healthcare-light/6 text-sm">P003</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
        <h4 className="text-healthcare-dark mb-4">Performance Metrics</h4>
        <div className="flex flex-col sm:flex-row justify-between items-start items-sm-end gap-4">
          <div>
            <p className="text-healthcare-light/6">Patient Satisfaction</p>
            <p className="text-2xl font-bold text-healthcare-accent">94%</p>
          </div>
          <div>
            <p className="text-healthcare-light/6">On-time rate</p>
            <p className="text-2xl font-bold text-healthcare-accent">98%</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-healthcare-light/20">
      <h4 className="text-healthcare-dark mb-4">Messages</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
          <span className="text-healthcare-light">Patient feedback received</span>
          <span className="text-healthcare-light/6 text-sm">Yesterday</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-healthcare-light/10 last:border-0">
          <span className="text-healthcare-light">Referral request</span>
          <span className="text-healthcare-light/6 text-sm">2 days ago</span>
        </div>
      </div>
    </div>
  </div>
);

export default DoctorDashboard;