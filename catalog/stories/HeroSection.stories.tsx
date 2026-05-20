import type { Meta, StoryObj } from '@storybook/react';
import { HeroWith3D, HeroMinimal } from '../../components/hero-section';

const meta: Meta = { title: 'Marketing/HeroSection', tags: ['autodocs'] };
export default meta;

export const With3DBackground: StoryObj = {
  render: () => (
    <HeroWith3D
      badge="Yeni — v4 çıktı"
      title="Awwwards Kalitesinde Landing Page"
      subtitle="GSAP + Framer Motion + Three.js ile dakikalar içinde üretin."
      ctaPrimary={{ label: 'Hemen Başla', href: '#' }}
      ctaSecondary={{ label: 'Demo İzle', href: '#' }}
    />
  ),
  parameters: { layout: 'fullscreen' },
};

export const Minimal: StoryObj = {
  render: () => (
    <HeroMinimal
      title="Minimal Hero Varyantı"
      subtitle="3D olmadan, saf Framer Motion ile hafif ve hızlı."
      ctaPrimary={{ label: 'Başla', href: '#' }}
    />
  ),
  parameters: { layout: 'fullscreen' },
};
