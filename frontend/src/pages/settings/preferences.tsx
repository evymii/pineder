import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "../../components/layout";
import { Button } from "../../design/system/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../design/system/card";
import { Label } from "../../design/system/label";
import { Switch } from "../../design/system/switch";
import { 
  Palette, 
  Monitor, 
  Smartphone, 
  Sun, 
  Moon, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  Type,
  Grid3X3
} from "lucide-react";
import Link from "next/link";

const PreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    theme: 'system',
    compactMode: false,
    showAnimations: true,
    autoSave: true,
    showTutorials: false,
    fontSize: 'medium',
    layoutDensity: 'comfortable',
    sidebarCollapsed: false,
    showStatusBar: true,
    enableSounds: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePreferenceChange = (key: keyof typeof preferences, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    if (message) setMessage(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ 
        type: 'success', 
        text: 'Preferences saved successfully!' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to save preferences. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Preferences
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your experience and interface preferences
            </p>
          </motion.div>

          {/* Preferences Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appearance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Palette className="w-5 h-5 text-purple-600" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handlePreferenceChange('theme', 'light')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          preferences.theme === 'light'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                        <span className="text-xs font-medium">Light</span>
                      </button>
                      <button
                        onClick={() => handlePreferenceChange('theme', 'dark')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          preferences.theme === 'dark'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Moon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <span className="text-xs font-medium">Dark</span>
                      </button>
                      <button
                        onClick={() => handlePreferenceChange('theme', 'system')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          preferences.theme === 'system'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Monitor className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <span className="text-xs font-medium">System</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Font Size
                    </Label>
                    <select
                      value={preferences.fontSize}
                      onChange={(e) => handlePreferenceChange('fontSize', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="extra-large">Extra Large</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show Animations
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Enable smooth transitions and animations
                      </p>
                    </div>
                    <Switch
                      checked={preferences.showAnimations}
                      onCheckedChange={(checked) => handlePreferenceChange('showAnimations', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Layout & Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Grid3X3 className="w-5 h-5 text-green-600" />
                    Layout & Interface
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Layout Density
                    </Label>
                    <select
                      value={preferences.layoutDensity}
                      onChange={(e) => handlePreferenceChange('layoutDensity', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="compact">Compact</option>
                      <option value="comfortable">Comfortable</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Compact Mode
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Reduce spacing and padding
                      </p>
                    </div>
                    <Switch
                      checked={preferences.compactMode}
                      onCheckedChange={(checked) => handlePreferenceChange('compactMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Collapsed Sidebar
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Start with sidebar minimized
                      </p>
                    </div>
                    <Switch
                      checked={preferences.sidebarCollapsed}
                      onCheckedChange={(checked) => handlePreferenceChange('sidebarCollapsed', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show Status Bar
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Display information bar at bottom
                      </p>
                    </div>
                    <Switch
                      checked={preferences.showStatusBar}
                      onCheckedChange={(checked) => handlePreferenceChange('showStatusBar', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Behavior */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Behavior
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto Save
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Automatically save changes
                      </p>
                    </div>
                    <Switch
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) => handlePreferenceChange('autoSave', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show Tutorials
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Display helpful tips and guides
                      </p>
                    </div>
                    <Switch
                      checked={preferences.showTutorials}
                      onCheckedChange={(checked) => handlePreferenceChange('showTutorials', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Sounds
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Play notification sounds
                      </p>
                    </div>
                    <Switch
                      checked={preferences.enableSounds}
                      onCheckedChange={(checked) => handlePreferenceChange('enableSounds', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Accessibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Type className="w-5 h-5 text-orange-600" />
                    Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      High Contrast Mode
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Increase contrast for better visibility
                    </p>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reduce Motion
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Minimize animations for accessibility
                    </p>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Screen Reader Support
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Enhanced support for screen readers
                    </p>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </motion.div>
          )}

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-lg rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Preferences...
                </div>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PreferencesPage; 