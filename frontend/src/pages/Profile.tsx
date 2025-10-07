import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  avatar?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-6 mb-6">
          <img
            src={profile?.avatar || '/default-avatar.png'}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
            <p className="text-gray-600">{profile?.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-700 mb-2">Role</h2>
            <p>{profile?.role}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-700 mb-2">Member Since</h2>
            <p>{new Date(profile?.joinedDate || '').toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
