import React, { useState, useEffect } from "react";
import { EmergencyContact, SOSAlert } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Phone, 
  Users,
  MapPin,
  Mic,
  Shield,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

import SOSButton from "../components/emergency/sosbutton.jsx";
import EmergencyContacts from "../components/emergency/emergencycontacts.jsx";
import { VoiceActivation } from "../components/emergency/VoiceActivation";

export default function Emergency() {
  const [contacts, setContacts] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmergencyData();
  }, []);

  const loadEmergencyData = async () => {
    try {
      const [contactList, activeAlerts] = await Promise.all([
        EmergencyContact.list(),
        SOSAlert.filter({ status: 'active' }, '-created_date', 1)
      ]);
      
      setContacts(contactList);
      if (activeAlerts.length > 0) {
        setActiveAlert(activeAlerts[0]);
      }
    } catch (error) {
      console.error("Error loading emergency data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSOSAlert = async (alertType = 'manual_sos', message = '') => {
    try {
      // Get current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const alertData = {
        alert_type: alertType,
        location: "Current Location", // In real app, reverse geocode
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        message: message,
        contacts_notified: contacts.map(c => c.id)
      };

      const alert = await SOSAlert.create(alertData);
      setActiveAlert(alert);
      
      // In real app, send notifications to emergency contacts
      console.log("SOS Alert sent:", alert);
      
    } catch (error) {
      console.error("Error sending SOS alert:", error);
      // Fallback - create alert without location
      const alert = await SOSAlert.create({
        alert_type: alertType,
        location: "Location unavailable",
        message: message,
        contacts_notified: contacts.map(c => c.id)
      });
      setActiveAlert(alert);
    }
  };

  const resolveAlert = async () => {
    if (activeAlert) {
      await SOSAlert.update(activeAlert.id, { 
        status: 'resolved',
        resolved_at: new Date().toISOString()
      });
      setActiveAlert(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Emergency Center</h1>
        <p className="text-slate-600">Your safety guardian is always here</p>
      </motion.div>

      {/* Active Alert Banner */}
      {activeAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-800">Active Emergency Alert</h3>
                    <p className="text-sm text-red-600">
                      Alert sent at {new Date(activeAlert.created_date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button onClick={resolveAlert} variant="outline" className="border-red-300 text-red-700">
                  Mark Safe
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* SOS Button */}
      <SOSButton onSOSAlert={handleSOSAlert} disabled={!!activeAlert} />

      {/* Voice Activation */}
      <VoiceActivation 
        isListening={isListening}
        onToggleListening={setIsListening}
        onVoiceAlert={handleSOSAlert}
        disabled={!!activeAlert}
      />

      {/* Emergency Contacts */}
      <EmergencyContacts 
        contacts={contacts}
        loading={loading}
        onContactsChange={loadEmergencyData}
      />
    </div>
  );
}