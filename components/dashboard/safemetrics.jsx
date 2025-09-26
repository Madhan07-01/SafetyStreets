import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { 
  Activity, 
  AlertTriangle, 
  Shield, 
  Users,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

const MetricCard = ({ title, value, icon: Icon, color, badge, loading }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-l ${color} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-600">
            {title}
          </CardTitle>
          <Icon className={`w-4 h-4 ${color.replace('bg-gradient-to-l', 'text').split(' ')[0]}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            {loading ? (
              <Skeleton className="h-8 w-16 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {value}
              </div>
            )}
            {badge && !loading && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function SafetyMetrics({ stats, loading }) {
  const metrics = [
    {
      title: "Total Safety Alerts",
      value: stats.totalAlerts,
      icon: Activity,
      color: "from-blue-500 to-blue-600",
      badge: stats.activeAlerts > 0 ? `${stats.activeAlerts} active` : "All resolved",
    },
    {
      title: "Emergency Contacts",
      value: stats.emergencyContacts,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      badge: stats.emergencyContacts > 0 ? "Ready" : "Setup needed",
    },
    {
      title: "Safety Reports",
      value: stats.safetyReports,
      icon: Shield,
      color: "from-emerald-500 to-emerald-600",
      badge: "Community data",
    },
    {
      title: "Safety Score",
      value: "95%",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      badge: "Excellent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.title}
          {...metric}
          loading={loading}
        />
      ))}
    </div>
  );
}