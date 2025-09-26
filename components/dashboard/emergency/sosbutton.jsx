import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { Textarea } from "../../../components/ui/textarea.jsx";
import { 
  AlertTriangle, 
  Phone,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function SOSButton({ onSOSAlert, disabled }) {
  const [isPressed, setIsPressed] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSOSPress = () => {
    if (disabled) return;
    
    setIsPressed(true);
    setTimeout(() => {
      onSOSAlert('manual_sos', message);
      setIsPressed(false);
      setMessage("");
      setShowMessage(false);
    }, 1000);
  };

  const handleQuickSOS = () => {
    if (disabled) return;
    onSOSAlert('manual_sos', 'Emergency assistance needed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Emergency SOS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                onClick={handleSOSPress}
                disabled={disabled || isPressed}
                className={`w-32 h-32 rounded-full text-xl font-bold shadow-2xl transition-all duration-300 ${
                  isPressed
                    ? 'bg-red-700 scale-110'
                    : disabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 hover:scale-105'
                }`}
              >
                {isPressed ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Sending...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="w-8 h-8" />
                    <span>SOS</span>
                  </div>
                )}
              </Button>
            </motion.div>
            
            <p className="text-sm text-slate-600 mt-4 max-w-sm mx-auto">
              Press and hold to send emergency alert to all your contacts with your current location
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowMessage(!showMessage)}
              disabled={disabled}
              className="flex-1"
            >
              Add Message
            </Button>
            <Button
              onClick={handleQuickSOS}
              disabled={disabled}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              <Phone className="w-4 h-4 mr-2" />
              Quick SOS
            </Button>
          </div>

          {showMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <Textarea
                placeholder="Add optional message to send with alert..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}