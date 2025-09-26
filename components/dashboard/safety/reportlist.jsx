import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx";
import { Badge } from "../../../components/ui/badge.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.jsx";
import { Skeleton } from "../../../components/ui/skeleton.jsx";
import { format } from "date-fns";
import { 
  MapPin, 
  Clock,
  Star,
  Filter,
  AlertTriangle,
  Shield,
  User,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";

const getReportTypeColor = (reportType) => {
  switch (reportType) {
    case 'incident':
    case 'suspicious_activity':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'poor_lighting':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'safe_zone':
    case 'well_lit':
    case 'police_presence':
    case 'busy_area':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const getSafetyRatingColor = (rating) => {
  if (rating >= 4) return 'text-green-600';
  if (rating >= 3) return 'text-yellow-600';
  return 'text-red-600';
};

const getReportIcon = (reportType) => {
  switch (reportType) {
    case 'incident':
    case 'suspicious_activity':
    case 'poor_lighting':
      return AlertTriangle;
    case 'safe_zone':
    case 'well_lit':
    case 'police_presence':
    case 'busy_area':
      return Shield;
    default:
      return MapPin;
  }
};

export default function ReportsList({ reports, loading, filterType, onFilterChange }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">Filter Reports</span>
            </div>
            <Select value={filterType} onValueChange={onFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Reports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="incident">Safety Incidents</SelectItem>
                <SelectItem value="safe_zone">Safe Zones</SelectItem>
                <SelectItem value="poor_lighting">Poor Lighting</SelectItem>
                <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                <SelectItem value="police_presence">Police Presence</SelectItem>
                <SelectItem value="well_lit">Well Lit Areas</SelectItem>
                <SelectItem value="busy_area">Busy Areas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No Safety Reports</h3>
            <p className="text-slate-500">
              {filterType === "all" 
                ? "No safety reports have been submitted yet." 
                : `No ${filterType.replace(/_/g, ' ')} reports found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report, index) => {
            const ReportIcon = getReportIcon(report.report_type);
            
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <ReportIcon className={`w-5 h-5 ${
                            report.report_type === 'incident' || report.report_type === 'suspicious_activity' || report.report_type === 'poor_lighting'
                              ? 'text-red-500'
                              : 'text-emerald-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <h3 className="font-semibold text-slate-900">{report.location}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{format(new Date(report.created_date), 'MMM d, yyyy h:mm a')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span className="capitalize">{report.time_of_day}</span>
                            </div>
                          </div>
                          {report.description && (
                            <p className="text-slate-700 text-sm mb-3">
                              {report.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1">
                          <Star className={`w-4 h-4 fill-current ${getSafetyRatingColor(report.safety_rating)}`} />
                          <span className={`text-sm font-medium ${getSafetyRatingColor(report.safety_rating)}`}>
                            {report.safety_rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge className={getReportTypeColor(report.report_type)}>
                          {report.report_type.replace(/_/g, ' ')}
                        </Badge>
                        {report.verified && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User className="w-3 h-3" />
                        <span>Community Report</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}