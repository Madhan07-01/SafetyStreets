import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Navigation, 
  AlertTriangle, 
  Shield, 
  Users,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Plan Safe Route",
    description: "Get the safest path to your destination",
    icon: Navigation,
    color: "from-blue-500 to-blue-600",
    link: createPageUrl("SafeNavigation"),
  },
  {
    title: "Send SOS Alert",
    description: "Emergency alert to all contacts",
    icon: AlertTriangle,
    color: "from-red-500 to-red-600",
    link: createPageUrl("Emergency"),
  },
  {
    title: "Report Safety Issue",
    description: "Help keep the community safe",
    icon: Shield,
    color: "from-emerald-500 to-emerald-600",
    link: createPageUrl("SafetyReports"),
  },
  {
    title: "Manage Contacts",
    description: "Update emergency contacts",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    link: createPageUrl("Profile"),
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={action.link}>
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors duration-300">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600 group-hover:text-slate-500 transition-colors duration-300">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}