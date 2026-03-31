import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BackToHome: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1.5">
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
};
