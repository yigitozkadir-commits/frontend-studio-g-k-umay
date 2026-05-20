import type { Meta, StoryObj } from '@storybook/react';
import { StatsGrid } from '../../components/stats-grid';
import { Users, ShoppingCart, TrendingUp, Activity } from 'lucide-react';

const meta: Meta<typeof StatsGrid> = { title: 'Dashboard/StatsGrid', component: StatsGrid, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof StatsGrid>;

const stats = [
  { label: 'Toplam Kullanıcı', value: '12,430', delta: 8,  icon: Users },
  { label: 'Aktif Oturum',    value: '1,892',  delta: 3,  icon: Activity },
  { label: 'Aylık Gelir',     value: '₺84.2K', delta: 14, icon: TrendingUp },
  { label: 'Siparişler',      value: '3,210',  delta: -2, icon: ShoppingCart },
];

export const Default: Story = { args: { stats } };
export const NoIcons: Story = { args: { stats: stats.map(({ icon: _icon, ...s }) => s) } };
export const NegativeDelta: Story = { args: { stats: [{ label: 'Bounce Rate', value: '%64', delta: -5 }] } };
