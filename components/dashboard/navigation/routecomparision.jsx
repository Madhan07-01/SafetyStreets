import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Badge } from "@/components/ui/badge.js";
import { 
  Route,
  Clock,
  MapPin,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function RouteComparison({ routes, selectedRoute, onRouteSelect }) {
  const RouteCard = ({ type, route, isSelected }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onRouteSelect(type)}
    >
      <Card className={`h-full transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 shadow-lg bg-blue-50/50' 
          : 'hover:shadow-lg border-slate-200'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {type === 'fastest' ? (
                <>
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span className="text-orange-600">Fastest Route</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="text-emerald-600">Safest Route</span>
                </>
              )}
            </CardTitle>
            {isSelected && (
              <CheckCircle className="w-5 h-5 text-blue-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{route.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{route.distance}</span>
              </div>
            </div>
            <Badge 
              className={`${
                route.safetyScore >= 90 
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : route.safetyScore >= 70 
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}
            >
              {route.safetyScore}% Safe
            </Badge>
          </div>

          <div className="text-sm">
            <p className="text-slate-600 mb-2">Route: {route.path}</p>
          </div>

          {route.warnings.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Safety Warnings
              </p>
              <div className="space-y-1">
                {route.warnings.map((warning, index) => (
                  <div key={index} className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {route.warnings.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              No safety concerns detected
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-slate-900">Route Comparison</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <RouteCard 
          type="fastest" 
          route={routes.fastest} 
          isSelected={selectedRoute === 'fastest'} 
        />
        <RouteCard 
          type="safest" 
          route={routes.safest} 
          isSelected={selectedRoute === 'safest'} 
        />
      </div>
      
      <div className="flex justify-center pt-4">
        <Button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 font-medium">
          <Route className="w-4 h-4 mr-2" />
          Start Navigation
        </Button>
      </div>
    </motion.div>
  );
}