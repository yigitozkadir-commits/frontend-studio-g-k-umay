import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from '../../components/modal';

const meta: Meta<typeof Modal> = { title: 'Feedback/Modal', component: Modal, tags: ['autodocs'] };
export default meta;

function ModalDemo({ title, children }: { title?: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-black text-white rounded-md text-sm">Modalı Aç</button>
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        {children ?? <p className="text-sm text-gray-600">Modal içeriği. ESC veya dışına tıklayarak kapatılır.</p>}
      </Modal>
    </div>
  );
}

export const Default: StoryObj = { render: () => <ModalDemo title="Örnek Modal" /> };
export const WithoutTitle: StoryObj = { render: () => <ModalDemo /> };
export const WithForm: StoryObj = {
  render: () => (
    <ModalDemo title="Hesap Sil">
      <p className="text-sm text-gray-600 mb-4">Bu işlem geri alınamaz. Devam etmek istiyor musunuz?</p>
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1.5 text-sm border rounded-md">İptal</button>
        <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md">Evet, Sil</button>
      </div>
    </ModalDemo>
  ),
};
