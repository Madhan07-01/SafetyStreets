import React, { useState, useEffect } from "react";
import { SafetyReport } from "@/entities/all";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { 
  Shield, 
  MapPin, 
  Plus,
  Filter,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

import ReportForm from "../components/safety/reportform.jsx";
import ReportsList from "../components/safety/reportlist.jsx";
import SafetyMap from "../components/safety/safetymap.jsx";

export default function SafetyReports() {
  const [reports, setReports] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const reportList = await SafetyReport.list('-created_date');
      setReports(reportList);
    } catch (error) {
      console.error("Error loading safety reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (reportData) => {
    try {
      await SafetyReport.create(reportData);
      setShowReportForm(false);
      loadReports();
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const filteredReports = filterType === "all" 
    ? reports 
    : reports.filter(report => report.report_type === filterType);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Safety Reports</h1>
        <p className="text-slate-600">Community-driven safety insights and alerts</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-xs text-slate-500">Total Reports</p>
                <p className="text-lg font-semibold">{reports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-slate-500">This Week</p>
                <p className="text-lg font-semibold">
                  {reports.filter(r => 
                    new Date(r.created_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-xs text-slate-500">Incidents</p>
                <p className="text-lg font-semibold">
                  {reports.filter(r => r.report_type === 'incident').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-slate-500">Safe Zones</p>
                <p className="text-lg font-semibold">
                  {reports.filter(r => r.report_type === 'safe_zone').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <Button
          onClick={() => setShowReportForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3"
        >
          <Plus className="w-4 h-4 mr-2" />
          Report Safety Issue
        </Button>
      </motion.div>

      {showReportForm && (
        <ReportForm 
          onSubmit={handleSubmitReport}
          onCancel={() => setShowReportForm(false)}
        />
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">Reports List</TabsTrigger>
            <TabsTrigger value="map">Safety Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="mt-6">
            <ReportsList 
              reports={filteredReports}
              loading={loading}
              filterType={filterType}
              onFilterChange={setFilterType}
            />
          </TabsContent>
          
          <TabsContent value="map" className="mt-6">
            <SafetyMap reports={reports} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

 