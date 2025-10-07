import React from 'react';
import PlaceholderPage from '@/components/PlaceholderPage';
import { Shield } from 'lucide-react';

const ContentModeration: React.FC = () => {
  return (
    <PlaceholderPage
      title="Content Moderation"
      description="This page will be implemented as part of the EduMindSolutions platform"
      icon={Shield}
    />
  );
};

export default ContentModeration;
