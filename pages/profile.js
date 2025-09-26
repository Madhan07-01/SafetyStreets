
import React, { useState, useEffect, useCallback } from "react";
import { User, EmergencyContact } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User as UserIcon, 
  Shield, 
  Settings,
  Bell,
  Phone,
  MapPin,
  Save
} from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [profileData, setProfileData] = useState({
    emergency_contact_phone: "",
    medical_conditions: "",
    preferred_hospital: "",
    safety_preferences: {
      auto_share_location: true,
      voice_activation: true,
      emergency_timeout: 30
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const currentUser = await User.me();
      const emergencyContacts = await EmergencyContact.list();
      
      setUser(currentUser);
      setContacts(emergencyContacts);
      
      // Load additional profile data if exists
      // We need to initialize profileData's safety_preferences from the existing state
      // to merge with currentUser's safety_preferences.
      // However, if currentUser.safety_preferences is undefined, we want to keep
      // the default initial state values.
      const initialSafetyPreferences = { 
        auto_share_location: true, 
        voice_activation: true, 
        emergency_timeout: 30 
      };

      setProfileData(prevProfileData => ({
        ...prevProfileData, // Keep existing safety_preferences if no user data overrides them
        emergency_contact_phone: currentUser.emergency_contact_phone || "",
        medical_conditions: currentUser.medical_conditions || "",
        preferred_hospital: currentUser.preferred_hospital || "",
        safety_preferences: {
          ...initialSafetyPreferences, // Start with defaults
          ...(currentUser.safety_preferences || {}) // Override with user's settings if they exist
        }
      }));
      
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array as setProfileData uses a functional update, setUser and setContacts don't depend on external state.

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Assuming User.updateMyUserData expects the full profileData object
      await User.updateMyUserData(profileData); 
      // Re-load data to ensure UI reflects the latest state, including any server-side transformations
      await loadUserData();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Safety Profile</h1>
        <p className="text-slate-600">Manage your safety settings and emergency information</p>
      </motion.div>

      {/* User Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <UserIcon className="w-5 h-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-600">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{user?.full_name || 'User'}</h3>
                <p className="text-slate-600">{user?.email}</p>
                <Badge className="mt-1 bg-emerald-100 text-emerald-700 border-emerald-200">
                  {user?.role || 'user'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Emergency Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_phone"
                  value={profileData.emergency_contact_phone}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    emergency_contact_phone: e.target.value
                  })}
                  placeholder="Primary emergency contact number"
                />
              </div>
              <div>
                <Label htmlFor="preferred_hospital">Preferred Hospital</Label>
                <Input
                  id="preferred_hospital"
                  value={profileData.preferred_hospital}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    preferred_hospital: e.target.value
                  })}
                  placeholder="Preferred hospital name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="medical_conditions">Medical Conditions</Label>
              <Input
                id="medical_conditions"
                value={profileData.medical_conditions}
                onChange={(e) => setProfileData({
                  ...profileData,
                  medical_conditions: e.target.value
                })}
                placeholder="Any medical conditions or allergies"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Contacts Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-500" />
                Emergency Contacts ({contacts.length})
              </CardTitle>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Phone className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No emergency contacts added yet</p>
                <p className="text-sm">Add contacts in the Emergency section</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.slice(0, 3).map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-slate-500">{contact.relationship} • {contact.phone}</p>
                      </div>
                    </div>
                    {contact.is_primary && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                ))}
                {contacts.length > 3 && (
                  <p className="text-sm text-slate-500 text-center">
                    +{contacts.length - 3} more contacts
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
