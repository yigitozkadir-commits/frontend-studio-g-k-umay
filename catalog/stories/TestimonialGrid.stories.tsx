import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialGrid } from '../../components/testimonial-grid';

const meta: Meta<typeof TestimonialGrid> = {
  title: 'Marketing/TestimonialGrid', component: TestimonialGrid, tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof TestimonialGrid>;

export const Default: Story = {};
export const DarkMode: Story = {
  decorators: [(Story) => <div className="dark bg-gray-950"><Story /></div>],
};
