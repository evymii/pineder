import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../design/system/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../design/system/avatar";
import { Badge } from "../../design/system/badge";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

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
    // Handle sign out logic here
    console.log("Signing out...");
    onClose();
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-10 text-left text-sm"
                      onClick={() => {
                        router.push("/settings/change-password");
                        onClose();
                      }}
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
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Sign Out</span>
              </Button>
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
    </AnimatePresence>
  );
};

export default UserSidebar;
