import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleSaveSettings = () => {
    // This is a placeholder for settings save functionality
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const settings = [
    {
      title: "Email Notifications",
      description: "Receive email updates about student activities",
      value: emailNotifications,
      onChange: setEmailNotifications,
    },
    {
      title: "Dark Mode",
      description: "Toggle dark mode theme",
      value: darkMode,
      onChange: setDarkMode,
    },
    {
      title: "Auto Save",
      description: "Automatically save changes",
      value: autoSave,
      onChange: setAutoSave,
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-2">Manage your application preferences</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Configure your application settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings.map((setting) => (
              <div
                key={setting.title}
                className="flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium">{setting.title}</h3>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
                <Switch
                  checked={setting.value}
                  onCheckedChange={setting.onChange}
                />
              </div>
            ))}
            <div className="pt-4">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;