import { useState, useEffect } from 'react';

interface Settings {
  emailNotifications: boolean;
  darkMode: boolean;
  autoSave: boolean;
}

const defaultSettings: Settings = {
  emailNotifications: true,
  darkMode: false,
  autoSave: true,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return { settings, updateSettings };
};