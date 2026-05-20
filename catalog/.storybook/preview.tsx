import type { Preview } from '@storybook/react';
import React from 'react';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="p-6 font-sans antialiased">
        <Story />
      </div>
    ),
  ],
};
export default preview;
