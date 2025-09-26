import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Shield, 
  Users, 
  Navigation,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";

export default function Welcome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Check if this is a new user (no emergency contacts or profile data)
      const isNew = !currentUser.emergency_contact_phone && 
                   !currentUser.safety_preferences;
      setIsNewUser(isNew);
      
    } catch (error) {
      console.error("Error loading user:", error);
      // If user is not authenticated, redirect to login
      await User.loginWithRedirect(window.location.origin + createPageUrl("Welcome"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Setting up your safety profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto p-6 py-12">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Welcome to Safe Streets!
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {isNewUser ? (
              <>Hello {user?.full_name?.split(' ')[0] || 'there'}! Let's set up your personal safety guardian.</>
            ) : (
              <>Welcome back, {user?.full_name?.split(' ')[0] || 'there'}! Your safety guardian is ready.</>
            )}
          </p>
        </motion.div>

        {isNewUser ? (
          /* New User Onboarding */
          <div className="space-y-8">
            {/* Setup Steps */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
                Let's get you protected in 3 simple steps
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-500 text-white">Step 1</Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Add Emergency Contacts
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Add trusted contacts who will be notified instantly in case of emergency.
                    </p>
                    <Link to={createPageUrl("Emergency")}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Add Contacts
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Step 2 */}
                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500 text-white">Step 2</Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mb-6">
                      <UserCheck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Complete Your Profile
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Add medical info and safety preferences for better protection.
                    </p>
                    <Link to={createPageUrl("Profile")}>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Setup Profile
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Step 3 */}
                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-500 text-white">Step 3</Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                      <Navigation className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Plan Your First Route
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Try our safe navigation to see the difference it makes.
                    </p>
                    <Link to={createPageUrl("SafeNavigation")}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Try Navigation
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Features Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-xl border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">
                    Your Complete Safety Ecosystem
                  </h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <Shield className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
                      <h4 className="font-semibold mb-2">Smart Routes</h4>
                      <p className="text-sm text-slate-300">AI-powered safe navigation</p>
                    </div>
                    <div className="text-center">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-red-400" />
                      <h4 className="font-semibold mb-2">SOS Alerts</h4>
                      <p className="text-sm text-slate-300">Instant emergency notifications</p>
                    </div>
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                      <h4 className="font-semibold mb-2">Community</h4>
                      <p className="text-sm text-slate-300">Crowd-sourced safety data</p>
                    </div>
                    <div className="text-center">
                      <Heart className="w-8 h-8 mx-auto mb-3 text-pink-400" />
                      <h4 className="font-semibold mb-2">Voice AI</h4>
                      <p className="text-sm text-slate-300">Hands-free panic detection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          /* Returning User Dashboard */
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <Link to={createPageUrl("Dashboard")}>
                <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Shield className="w-8 h-8 text-blue-600" />
                      <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Dashboard</h3>
                    <p className="text-sm text-slate-600">View your safety overview</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to={createPageUrl("SafeNavigation")}>
                <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Navigation className="w-8 h-8 text-emerald-600" />
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Safe Routes</h3>
                    <p className="text-sm text-slate-600">Plan your safest path</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to={createPageUrl("Emergency")}>
                <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-red-100 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                      <ArrowRight className="w-4 h-4 text-red-400 group-hover:text-red-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Emergency</h3>
                    <p className="text-sm text-slate-600">SOS & emergency contacts</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to={createPageUrl("SafetyReports")}>
                <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-purple-600" />
                      <ArrowRight className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Community</h3>
                    <p className="text-sm text-slate-600">Safety reports & insights</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <Card className="shadow-xl border-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <CardContent className="p-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">You're All Set!</h3>
                  <p className="text-emerald-100 mb-6">
                    Your safety guardian is active and ready to protect you wherever you go.
                  </p>
                  <Link to={createPageUrl("Dashboard")}>
                    <Button variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Safety Tip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-800 mb-2">Safety Tip</h4>
                  <p className="text-yellow-700">
                    Always let someone know your planned route and expected arrival time. 
                    Safe Streets can automatically send arrival confirmations to your emergency contacts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}