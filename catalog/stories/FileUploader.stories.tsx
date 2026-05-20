import type { Meta, StoryObj } from '@storybook/react';
import { FileUploader } from '../../components/file-uploader';

const meta: Meta<typeof FileUploader> = {
  title: 'Forms/FileUploader', component: FileUploader, tags: ['autodocs'],
  argTypes: {
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    maxSizeMb: { control: { type: 'number', min: 1, max: 100 } },
  },
};
export default meta;
type Story = StoryObj<typeof FileUploader>;

export const Default: Story = {
  args: {
    accept: 'image/*,application/pdf', multiple: true, maxSizeMb: 10,
    onUpload: async (files) => { await new Promise((r) => setTimeout(r, 1500)); console.log('Yüklendi:', files.map((f) => f.name)); },
  },
};
export const ImageOnly: Story = { args: { accept: 'image/*', multiple: false, maxSizeMb: 5 } };
export const LargeLimit: Story = { args: { accept: '*/*', multiple: true, maxSizeMb: 100 } };
