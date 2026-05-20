import type { Meta, StoryObj } from '@storybook/react';
import { AuthForm } from '../../components/auth-form';

const meta: Meta<typeof AuthForm> = {
  title: 'Forms/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'radio', options: ['login', 'register'] },
  },
};
export default meta;
type Story = StoryObj<typeof AuthForm>;

export const Login: Story = {
  args: {
    mode: 'login',
    onSubmit: async (v) => console.log('submit', v),
  },
};

export const Register: Story = { args: { ...Login.args, mode: 'register' } };
