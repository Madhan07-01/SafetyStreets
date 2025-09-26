import React, { useState, useEffect } from "react";
import { SOSAlert, SafetyReport, EmergencyContact } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Shield, 
  AlertTriangle, 
  Navigation, 
  Users, 
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

import QuickActions from "../components/dashboard/QuickActions.jsx";
import SafetyMetrics from "../components/dashboard/SafetyMetrics.js";
import RecentActivity from "../components/dashboard/RecentActivity.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    safetyReports: 0,
    emergencyContacts: 0
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [alerts, reports, contacts] = await Promise.all([
        SOSAlert.list('-created_date', 5),
        SafetyReport.list('-created_date', 5),
        EmergencyContact.list()
      ]);

      const activeAlerts = alerts.filter(alert => alert.status === 'active').length;

      setStats({
        totalAlerts: alerts.length,
        activeAlerts,
        safetyReports: reports.length,
        emergencyContacts: contacts.length
      });

      setRecentAlerts(alerts);
      setRecentReports(reports);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Stay Safe, Stay Connected
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Your personal safety guardian providing smart navigation, emergency alerts, and community-driven safety insights.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Safety Metrics */}
      <SafetyMetrics stats={stats} loading={loading} />

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <RecentActivity 
          title="Recent Alerts"
          items={recentAlerts}
          type="alerts"
          loading={loading}
        />
        <RecentActivity 
          title="Safety Reports"
          items={recentReports}
          type="reports"
          loading={loading}
        />
      </div>

      {/* Safety Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Shield className="w-5 h-5" />
              Daily Safety Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-700">
              Always share your planned route with trusted contacts before traveling, especially during evening hours. 
              Our Safe Navigation feature can automatically notify your emergency contacts when you reach your destination.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}