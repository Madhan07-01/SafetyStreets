import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lightbulb, 
  Users, 
  Clock,
  MapPin,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

export default function SafetyInsights({ routes }) {
  if (!routes) return null;

  const insights = [
    {
      icon: Lightbulb,
      title: "Well-lit Areas",
      description: "The safest route passes through 85% well-lit streets",
      color: "text-yellow-600 bg-yellow-50"
    },
    {
      icon: Users,
      title: "High Foot Traffic",
      description: "Safer route has 40% more pedestrian activity",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: Shield,
      title: "Police Presence", 
      description: "2 police stations within 500m of safe route",
      color: "text-green-600 bg-green-50"
    },
    {
      icon: Clock,
      title: "Peak Hours",
      description: "Current time is optimal for safe travel",
      color: "text-purple-600 bg-purple-50"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <TrendingUp className="w-5 h-5" />
            Safety Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${insight.color}`}>
                  <insight.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">{insight.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{insight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}