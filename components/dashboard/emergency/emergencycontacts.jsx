import React, { useState } from "react";
import { EmergencyContact } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Plus,
  Phone,
  Mail,
  Trash2,
  UserPlus,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

export default function EmergencyContacts({ contacts, loading, onContactsChange }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
    is_primary: false,
    notify_sms: true,
    notify_email: true
  });

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) return;
    
    try {
      await EmergencyContact.create(newContact);
      setNewContact({
        name: "",
        phone: "",
        relationship: "",
        is_primary: false,
        notify_sms: true,
        notify_email: true
      });
      setShowAddForm(false);
      onContactsChange();
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await EmergencyContact.delete(contactId);
      onContactsChange();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleSetPrimary = async (contactId) => {
    try {
      // First, set all contacts to not primary
      await Promise.all(
        contacts.map(contact => 
          EmergencyContact.update(contact.id, { is_primary: false })
        )
      );
      
      // Then set the selected contact as primary
      await EmergencyContact.update(contactId, { is_primary: true });
      onContactsChange();
    } catch (error) {
      console.error("Error setting primary contact:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Emergency Contacts ({contacts.length})
            </CardTitle>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Contact Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border rounded-lg p-4 bg-slate-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select
                    value={newContact.relationship}
                    onValueChange={(value) => setNewContact({...newContact, relationship: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="neighbor">Neighbor</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={handleAddContact} className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Contacts List */}
          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No emergency contacts added yet</p>
              <p className="text-sm">Add at least one contact for emergency alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{contact.name}</h4>
                          {contact.is_primary && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Star className="w-3 h-3 mr-1" />
                              Primary
                            </Badge>
                          )}
                          <Badge variant="outline" className="capitalize">
                            {contact.relationship}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </span>
                          <div className="flex gap-2">
                            {contact.notify_sms && (
                              <Badge variant="outline" className="text-xs">SMS</Badge>
                            )}
                            {contact.notify_email && (
                              <Badge variant="outline" className="text-xs">Email</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!contact.is_primary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetPrimary(contact.id)}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}