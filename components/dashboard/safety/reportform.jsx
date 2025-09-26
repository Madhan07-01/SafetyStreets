import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { Label } from "../../../components/ui/label.jsx";
import { Textarea } from "../../../components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.jsx";
import { Badge } from "../../../components/ui/badge.jsx";
import { 
  MapPin, 
  Star,
  AlertTriangle,
  Shield,
  X,
  Send
} from "lucide-react";
import { motion } from "framer-motion";

const REPORT_TYPES = [
  { value: "incident", label: "Safety Incident", color: "text-red-600", icon: AlertTriangle },
  { value: "safe_zone", label: "Safe Zone", color: "text-green-600", icon: Shield },
  { value: "poor_lighting", label: "Poor Lighting", color: "text-yellow-600", icon: AlertTriangle },
  { value: "suspicious_activity", label: "Suspicious Activity", color: "text-red-600", icon: AlertTriangle },
  { value: "police_presence", label: "Police Presence", color: "text-blue-600", icon: Shield },
  { value: "well_lit", label: "Well Lit Area", color: "text-green-600", icon: Shield },
  { value: "busy_area", label: "Busy Area", color: "text-blue-600", icon: Shield },
];

const TIME_OPTIONS = [
  { value: "morning", label: "Morning (6AM - 12PM)" },
  { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
  { value: "evening", label: "Evening (6PM - 10PM)" },
  { value: "night", label: "Night (10PM - 2AM)" },
  { value: "late_night", label: "Late Night (2AM - 6AM)" },
];

export default function ReportForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    location: "",
    latitude: null,
    longitude: null,
    safety_rating: 3,
    report_type: "",
    description: "",
    time_of_day: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            location: formData.location || "Current Location"
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || !formData.report_type || !formData.time_of_day) return;
    
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedReportType = REPORT_TYPES.find(type => type.value === formData.report_type);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Report Safety Issue
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Enter location or address"
                    className="flex-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
                {formData.latitude && formData.longitude && (
                  <p className="text-xs text-green-600">
                    Location coordinates captured ✓
                  </p>
                )}
              </div>

              {/* Safety Rating */}
              <div className="space-y-3">
                <Label>Safety Rating *</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({...formData, safety_rating: rating})}
                      className={`p-2 rounded-lg transition-colors ${
                        formData.safety_rating >= rating
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="text-sm text-slate-600 ml-2">
                    ({formData.safety_rating}/5 - {
                      formData.safety_rating <= 2 ? 'Unsafe' :
                      formData.safety_rating <= 3 ? 'Neutral' : 'Safe'
                    })
                  </span>
                </div>
              </div>

              {/* Report Type */}
              <div className="space-y-2">
                <Label>Report Type *</Label>
                <Select
                  value={formData.report_type}
                  onValueChange={(value) => setFormData({...formData, report_type: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className={`w-4 h-4 ${type.color}`} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedReportType && (
                  <Badge className={`${selectedReportType.color} bg-opacity-10`}>
                    {selectedReportType.label}
                  </Badge>
                )}
              </div>

              {/* Time of Day */}
              <div className="space-y-2">
                <Label>Time of Day *</Label>
                <Select
                  value={formData.time_of_day}
                  onValueChange={(value) => setFormData({...formData, time_of_day: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="When did you observe this?" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide additional details about the safety concern or positive observation..."
                  rows={4}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !formData.location || !formData.report_type || !formData.time_of_day}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Report
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}