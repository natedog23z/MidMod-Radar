import React from 'react';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { StyleTiles } from '../components/landing/StyleTiles';
import { SocialProof } from '../components/landing/SocialProof';
import { PlanPreview } from '../components/landing/PlanPreview';
import { EmailCapture } from '../components/landing/EmailCapture';
import { Footer } from '../components/landing/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <StyleTiles />
      <SocialProof />
      <PlanPreview />
      <EmailCapture />
      <Footer />
    </div>
  );
}; 