import type { Meta, StoryObj } from '@storybook/react';
import { PricingTable } from '../../components/pricing-table';

const meta: Meta<typeof PricingTable> = {
  title: 'Marketing/PricingTable', component: PricingTable, tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof PricingTable>;

export const Default: Story = {};
export const DarkBackground: Story = {
  decorators: [(Story) => <div className="dark bg-gray-950 min-h-screen"><Story /></div>],
};
