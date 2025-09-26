
import React, { useState, useEffect } from "react";
import { User, EmergencyContact } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Shield, 
  Users, 
  User as UserIcon,
  Check,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ONBOARDING_STEPS = [
  { id: 1, title: "Emergency Contacts", icon: Users },
  { id: 2, title: "Safety Profile", icon: UserIcon },
  { id: 3, title: "Preferences", icon: Shield },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Step 1: Emergency Contacts
  const [contacts, setContacts] = useState([
    { name: "", phone: "", relationship: "family" }
  ]);

  // Step 2: Safety Profile
  const [profileData, setProfileData] = useState({
    emergency_contact_phone: "",
    medical_conditions: "",
    preferred_hospital: ""
  });

  // Step 3: Preferences
  const [preferences, setPreferences] = useState({
    auto_share_location: true,
    voice_activation: true,
    emergency_timeout: 30,
    notification_sms: true,
    notification_email: true
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
      await User.loginWithRedirect(window.location.origin + createPageUrl("Onboarding"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    setContacts([...contacts, { name: "", phone: "", relationship: "family" }]);
  };

  const handleRemoveContact = (index) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      // Save emergency contacts
      const validContacts = contacts.filter(c => c.name && c.phone);
      for (let i = 0; i < validContacts.length; i++) {
        await EmergencyContact.create({
          ...validContacts[i],
          is_primary: i === 0,
          notify_sms: preferences.notification_sms,
          notify_email: preferences.notification_email
        });
      }

      // Save user profile data
      await User.updateMyUserData({
        ...profileData,
        safety_preferences: preferences,
        onboarding_completed: true
      });

      // Redirect to welcome page
      navigate(createPageUrl("Welcome"));
      
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return contacts.some(c => c.name && c.phone);
      case 2:
        return profileData.emergency_contact_phone;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  const progress = (currentStep / ONBOARDING_STEPS.length) * 100;
  const currentStepData = ONBOARDING_STEPS[currentStep - 1];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome to Safe Streets
          </h1>
          <p className="text-slate-600">
            Hello {user?.full_name?.split(' ')[0]}! Let's set up your safety profile in just a few steps.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {ONBOARDING_STEPS.map((step) => {
              const StepIconComponent = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIconComponent className="w-5 h-5" />
                    )}
                  </div>
                  {step.id < ONBOARDING_STEPS.length && (
                    <div className={`w-20 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-slate-600 mt-2">
            <span>Step {currentStep} of {ONBOARDING_STEPS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStepData.icon && (
                    <StepIcon className="w-5 h-5 text-emerald-600" />
                  )}
                  {currentStepData.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Emergency Contacts */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-slate-600">
                      Add at least one emergency contact who will be notified instantly if you need help.
                    </p>
                    {contacts.map((contact, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-slate-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Contact {index + 1}</h4>
                          {index === 0 && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Primary
                            </Badge>
                          )}
                          {contacts.length > 1 && index > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveContact(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label>Full Name</Label>
                            <Input
                              value={contact.name}
                              onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                              placeholder="Enter name"
                            />
                          </div>
                          <div>
                            <Label>Phone Number</Label>
                            <Input
                              value={contact.phone}
                              onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                              placeholder="Enter phone"
                            />
                          </div>
                          <div>
                            <Label>Relationship</Label>
                            <Select
                              value={contact.relationship}
                              onValueChange={(value) => handleContactChange(index, 'relationship', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="family">Family</SelectItem>
                                <SelectItem value="friend">Friend</SelectItem>
                                <SelectItem value="partner">Partner</SelectItem>
                                <SelectItem value="colleague">Colleague</SelectItem>
                                <SelectItem value="neighbor">Neighbor</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={handleAddContact}
                      className="w-full"
                    >
                      Add Another Contact
                    </Button>
                  </div>
                )}

                {/* Step 2: Safety Profile */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-slate-600">
                      This information helps emergency responders assist you better.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="emergency_phone">Primary Emergency Phone *</Label>
                        <Input
                          id="emergency_phone"
                          value={profileData.emergency_contact_phone}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            emergency_contact_phone: e.target.value
                          })}
                          placeholder="Your primary contact number"
                          required
                        />
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
                          placeholder="Any medical conditions or allergies (optional)"
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
                          placeholder="Your preferred hospital (optional)"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Preferences */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <p className="text-slate-600">
                      Customize how Safe Streets protects you.
                    </p>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Safety Features</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="auto_share"
                            checked={preferences.auto_share_location}
                            onCheckedChange={(checked) => setPreferences({
                              ...preferences,
                              auto_share_location: checked
                            })}
                          />
                          <Label htmlFor="auto_share">
                            Auto-share location during emergencies
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="voice_activation"
                            checked={preferences.voice_activation}
                            onCheckedChange={(checked) => setPreferences({
                              ...preferences,
                              voice_activation: checked
                            })}
                          />
                          <Label htmlFor="voice_activation">
                            Enable voice-activated panic detection
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="notification_sms"
                            checked={preferences.notification_sms}
                            onCheckedChange={(checked) => setPreferences({
                              ...preferences,
                              notification_sms: checked
                            })}
                          />
                          <Label htmlFor="notification_sms">
                            Send SMS alerts to emergency contacts
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="notification_email"
                            checked={preferences.notification_email}
                            onCheckedChange={(checked) => setPreferences({
                              ...preferences,
                              notification_email: checked
                            })}
                          />
                          <Label htmlFor="notification_email">
                            Send email alerts to emergency contacts
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up...
              </div>
            ) : currentStep === 3 ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Complete Setup
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
