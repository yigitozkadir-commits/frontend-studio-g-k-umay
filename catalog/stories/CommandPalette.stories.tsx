import type { Meta, StoryObj } from '@storybook/react';
import { CommandPalette } from '../../components/command-palette';

const meta: Meta<typeof CommandPalette> = {
  title: 'Navigation/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
};
export default meta;

export const Default: StoryObj<typeof CommandPalette> = {
  args: {
    open: true,
    commands: [
      { id: 'open', label: 'Open file', hint: '⌘O', run: () => console.log('open') },
      { id: 'save', label: 'Save', hint: '⌘S', run: () => console.log('save') },
      { id: 'theme', label: 'Toggle theme', group: 'Settings', run: () => console.log('theme') },
    ],
  },
};
