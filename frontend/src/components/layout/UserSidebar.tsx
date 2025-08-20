import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../design/system/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../design/system/avatar";
import { Badge } from "../../design/system/badge";
import { Input } from "../../design/system/input";
import { Label } from "../../design/system/label";
import {
  User,
  Settings,
  Lock,
  LogOut,
  Edit,
  X,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SignOutButton } from "@clerk/nextjs";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    role: "student" | "mentor" | "admin";
    avatar?: string;
    initials: string;
  };
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose, user }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEditProfile = () => {
    // Route to appropriate profile page based on user role
    if (user.role === "mentor") {
      router.push("/profile/mentor");
    } else if (user.role === "student") {
      router.push("/profile/student");
    }
    onClose(); // Close sidebar after navigation
  };

  const handleSignOut = () => {
    // Close sidebar before sign out
    onClose();
  };

  const changePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("New password must be at least 8 characters long!");
      return;
    }

    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    alert("Password changed successfully!");
  };

  const resetPasswordForm = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPassword(false);
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case "student":
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case "mentor":
        return <Briefcase className="w-4 h-4 text-green-600" />;
      case "admin":
        return <User className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case "student":
        return "Student";
      case "mentor":
        return "Mentor";
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "mentor":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 border-l shadow-xl z-50 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-foreground">
                User Menu
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleIcon()}
                    <Badge variant="secondary" className={getRoleColor()}>
                      {getRoleLabel()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-2">
              {/* Dashboard */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left"
                onClick={() => {
                  if (user.role === "mentor") {
                    router.push("/user/mentor-dashboard");
                  } else {
                    router.push("/user/dashboard");
                  }
                  onClose();
                }}
              >
                <GraduationCap className="w-5 h-5 mr-3 text-green-600" />
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>

              {/* Edit Profile */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left"
                onClick={handleEditProfile}
              >
                <Edit className="w-5 h-5 mr-3 text-blue-600" />
                <span>Edit Profile</span>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>

              {/* Account Settings */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Settings className="w-5 h-5 mr-3 text-gray-600" />
                <span>Account Settings</span>
                <ChevronRight
                  className={`w-4 h-4 ml-auto text-muted-foreground transition-transform ${
                    isMenuOpen ? "rotate-90" : ""
                  }`}
                />
              </Button>

              {/* Account Settings Submenu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-6 space-y-1"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-10 text-left text-sm"
                      onClick={() => {
                        if (user.role === "mentor") {
                          router.push("/profile/mentor");
                        } else {
                          router.push("/profile/student");
                        }
                        onClose();
                      }}
                    >
                      <User className="w-4 h-4 mr-3 text-muted-foreground" />
                      <span>Profile Settings</span>
                    </Button>
                    {/* Password Change Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-10 text-left text-sm"
                      onClick={() => setShowPassword(true)}
                    >
                      <Lock className="w-4 h-4 mr-3 text-muted-foreground" />
                      <span>Change Password</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-10 text-left text-sm"
                      onClick={() => {
                        router.push("/settings/preferences");
                        onClose();
                      }}
                    >
                      <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
                      <span>Preferences</span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign Out */}
              <SignOutButton>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Sign Out</span>
                </Button>
              </SignOutButton>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Pineder Platform v1.0
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Password Change Dialog */}
      <AnimatePresence>
        {showPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowPassword(false)}
          >
            {/* Enhanced Background with Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div
                className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>

              {/* Floating particles */}
              <div
                className="absolute top-20 left-20 w-4 h-4 bg-yellow-400/30 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute top-40 right-32 w-3 h-3 bg-pink-400/40 rounded-full animate-bounce"
                style={{ animationDelay: "1.5s" }}
              ></div>
              <div
                className="absolute bottom-32 left-32 w-5 h-5 bg-blue-400/30 rounded-full animate-bounce"
                style={{ animationDelay: "0.8s" }}
              ></div>
              <div
                className="absolute bottom-20 right-20 w-2 h-2 bg-green-400/50 rounded-full animate-bounce"
                style={{ animationDelay: "2.2s" }}
              ></div>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20, rotateX: -15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl transition-all duration-200 backdrop-blur-xl border perspective-1000 bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 border-gray-200/50"
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
              }}
            >
              {/* Enhanced Header with Green Gradient */}
              <div className="relative p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Change Password
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(false)}
                    className="h-10 w-10 p-0 rounded-full hover:bg-white/50 transition-all duration-200 hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Enhanced Content */}
              <div className="p-6 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="oldPassword"
                    className="text-sm font-semibold text-gray-700 flex items-center space-x-2"
                  >
                    <span>Current Password</span>
                  </Label>
                  <div className="relative group">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-blue-50 transition-all duration-200"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4 text-green-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-semibold text-gray-700 flex items-center space-x-2"
                  >
                    <span>New Password</span>
                  </Label>
                  <div className="relative group">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-green-50 transition-all duration-200"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-green-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-gray-700 flex items-center space-x-2"
                  >
                    <span>Confirm New Password</span>
                  </Label>
                  <div className="relative group">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-purple-50 transition-all duration-200"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-green-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Actions */}
              <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-3xl">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPassword(false)}
                    className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={changePassword}
                    className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default UserSidebar;
