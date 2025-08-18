"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut, X, Lock, Eye, EyeOff } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../design/system/avatar";
import { createPortal } from "react-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import { Button } from "../../../design/system/button";
import { Badge } from "../../../design/system/badge";
import { Input } from "../../../design/system/input";
import { Label } from "../../../design/system/label";

interface UserProfileProps {
  user?: {
    name: string;
    username: string;
    avatar?: string;
    role: "student" | "mentor";
    rating?: number;
    topics?: string[];
    bio?: string;
  };
  isSignedIn?: boolean;
}

export function UserProfile({ user, isSignedIn = false }: UserProfileProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const userData = user || {
    name: "Alex Johnson",
    username: "@alexj",
    role: "student" as const,
    rating: 4.8,
    topics: ["React", "TypeScript", "Node.js"],
    bio: "Passionate about learning web development and building amazing applications.",
  };

  if (!isSignedIn) {
    return null;
  }

  const closeProfile = () => {
    setOpen(false);
  };

  const openProfile = () => {
    setOpen(true);
  };

  if (!mounted) {
    return (
      <Avatar className="w-10 h-10 border-2 border-transparent hover:border-[var(--pico-secondary)] transition-colors">
        <AvatarFallback className="bg-gradient-to-br from-[var(--pico-secondary)] to-[var(--pico-accent)] text-white">
          {userData.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
    );
  }

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

  return (
    <>
      {/* Profile Avatar Button */}
      <Avatar
        className="w-10 h-10 border-2 border-transparent hover:border-[var(--pico-secondary)] transition-colors cursor-pointer"
        onClick={openProfile}
      >
            <AvatarFallback className="bg-gradient-to-br from-[var(--pico-secondary)] to-[var(--pico-accent)] text-white">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
        </Avatar>

      {/* Profile Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
                onClick={closeProfile}
            />

            {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-xl font-semibold">
                    User Profile
                  </CardTitle>
                            <Button
                              variant="ghost"
                              size="icon"
                onClick={closeProfile}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                        </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-gradient-to-br from-[var(--pico-secondary)] to-[var(--pico-accent)] text-white text-2xl">
                                {userData.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                          </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{userData.name}</h3>
                      <p className="text-muted-foreground">{userData.username}</p>
                      <Badge variant="secondary" className="mt-2">
                        {userData.role}
                      </Badge>
                        </div>
                        </div>

                  {/* Profile Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                                {userData.bio}
                              </p>
                        </div>

                    {userData.topics && userData.topics.length > 0 && (
                      <div>
                        <Label>Topics of Interest</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {userData.topics.map((topic, index) => (
                            <Badge key={index} variant="outline">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {userData.rating && (
                      <div>
                        <Label>Rating</Label>
                        <div className="flex items-center mt-2">
                          <span className="text-2xl font-bold text-yellow-500">
                            {userData.rating}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            / 5.0
                          </span>
                          </div>
                        </div>
                    )}
                        </div>

                  {/* Password Change Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Password</Label>
                          <Button
                            variant="outline"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                          >
                        {showPassword ? "Cancel" : "Change Password"}
                          </Button>
                        </div>

        {showPassword && (
              <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 p-4 border rounded-lg bg-muted/50"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="oldPassword">Current Password</Label>
                          <div className="relative">
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
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                              {showOldPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
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
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
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
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button onClick={changePassword} className="flex-1">
                            Update Password
                          </Button>
                          <Button
                            variant="outline"
                            onClick={resetPasswordForm}
                            className="flex-1"
                          >
                            Reset
                          </Button>
                        </div>
      </motion.div>
                    )}
                      </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => {
                        // Handle edit profile
                        console.log("Edit profile clicked");
                      }}
                            className="flex-1"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                        // Handle sign out
                        console.log("Sign out clicked");
                      }}
                            className="flex-1"
                          >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                          </Button>
                        </div>
                            </CardContent>
                          </Card>
      </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
