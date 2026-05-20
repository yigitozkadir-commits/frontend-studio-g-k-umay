import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '../../components/data-table';

interface User { id: number; name: string; email: string; }
const data: User[] = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1, name: `User ${i + 1}`, email: `user${i + 1}@example.com`,
}));

const meta: Meta<typeof DataTable<User>> = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};
export default meta;

export const Virtualized: StoryObj<typeof DataTable<User>> = {
  args: {
    data,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'İsim' },
      { accessorKey: 'email', header: 'E-posta' },
    ],
  },
};
