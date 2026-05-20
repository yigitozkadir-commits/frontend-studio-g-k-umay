import type { Meta, StoryObj } from '@storybook/react';
import { DashboardSidebar, DashboardHeader } from '../../components/dashboard-sidebar';

jest.mock('next/navigation', () => ({ usePathname: () => '/dashboard' }));
jest.mock('../../snippets/state-management', () => ({
  useUIStore: () => ({ sidebarOpen: true, toggleSidebar: () => {} }),
}));

const meta: Meta = { title: 'Dashboard/DashboardSidebar', tags: ['autodocs'], parameters: { layout: 'fullscreen' } };
export default meta;

export const Expanded: StoryObj = {
  render: () => (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Genel Bakış" />
        <main className="p-6 text-gray-400 text-sm">Sayfa içeriği buraya gelir.</main>
      </div>
    </div>
  ),
};
export const HeaderOnly: StoryObj = {
  render: () => <div className="border"><DashboardHeader title="Kullanıcılar" /></div>,
  parameters: { layout: 'padded' },
};
