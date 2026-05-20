import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from '../../components/footer';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer', component: Footer, tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof Footer>;

const columns = [
  { title: 'Ürün', links: [{ href: '#', label: 'Özellikler' }, { href: '#', label: 'Fiyatlandırma' }] },
  { title: 'Kaynaklar', links: [{ href: '#', label: 'Dokümantasyon' }, { href: '#', label: 'Blog' }] },
  { title: 'Şirket', links: [{ href: '#', label: 'Hakkında' }, { href: '#', label: 'İş İlanları' }] },
];

export const FullColumns: Story = { args: { brand: 'AI Frontend Studio', columns, copyright: '© 2026 AI Frontend Studio.' } };
export const Minimal: Story = { args: { brand: 'Studio', columns: [] } };
