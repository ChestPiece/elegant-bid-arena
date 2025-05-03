
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfileProps {
  minimal?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ minimal = false }) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user) return '';
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };
  
  if (minimal) {
    return (
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{user.email}</span>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-medium">{user.email}</h3>
            <p className="text-sm text-muted-foreground">
              User ID: {user.id.substring(0, 8)}...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
