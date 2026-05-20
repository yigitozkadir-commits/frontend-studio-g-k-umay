import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from '../../components/navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Layout/Navbar', component: Navbar, tags: ['autodocs'],
  argTypes: { brand: { control: 'text' } },
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof Navbar>;

const sampleItems = [
  { href: '#features', label: 'Özellikler' },
  { href: '#pricing', label: 'Fiyatlandırma' },
  { href: '#docs', label: 'Dokümantasyon' },
];

export const Default: Story = { args: { brand: 'Studio', items: sampleItems, cta: { href: '#', label: 'Ücretsiz Dene' } } };
export const BrandOnly: Story = { args: { brand: 'Minimal App', items: [] } };
export const NoCTA: Story = { args: { brand: 'Studio', items: sampleItems } };
