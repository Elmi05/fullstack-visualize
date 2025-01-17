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
import { useSettings } from "@/hooks/useSettings";

const Settings = () => {
  const { toast } = useToast();
  const { settings, updateSettings } = useSettings();

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const settings_config = [
    {
      title: "Email Notifications",
      description: "Receive email updates about student activities",
      value: settings.emailNotifications,
      onChange: (value: boolean) => updateSettings({ emailNotifications: value }),
    },
    {
      title: "Dark Mode",
      description: "Toggle dark mode theme",
      value: settings.darkMode,
      onChange: (value: boolean) => updateSettings({ darkMode: value }),
    },
    {
      title: "Auto Save",
      description: "Automatically save changes",
      value: settings.autoSave,
      onChange: (value: boolean) => updateSettings({ autoSave: value }),
    },
  ];

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your application preferences</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Configure your application settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings_config.map((setting) => (
              <div
                key={setting.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0"
              >
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium">{setting.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                </div>
                <Switch
                  checked={setting.value}
                  onCheckedChange={setting.onChange}
                  className="ml-0 sm:ml-4"
                />
              </div>
            ))}
            <div className="pt-4">
              <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;