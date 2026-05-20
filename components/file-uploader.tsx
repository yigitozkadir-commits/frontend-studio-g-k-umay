/**
 * FileUploader — Drag & drop, çoklu dosya, progress, validation.
 */
'use client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  onUpload?: (files: File[]) => Promise<void>;
}

export function FileUploader({
  accept = 'image/*,application/pdf',
  multiple = true,
  maxSizeMb = 10,
  onUpload
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [list, setList] = useState<File[]>([]);

  const handle = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const arr = Array.from(files);
      const tooBig = arr.find((f) => f.size > maxSizeMb * 1024 * 1024);
      if (tooBig) {
        toast.error(`${tooBig.name}: ${maxSizeMb}MB sınırını aşıyor`);
        return;
      }
      setList(arr);
      if (onUpload) {
        setBusy(true);
        try {
          await onUpload(arr);
          toast.success(`${arr.length} dosya yüklendi`);
        } catch (e: any) {
          toast.error(e?.message ?? 'Yükleme başarısız');
        } finally {
          setBusy(false);
        }
      }
    },
    [maxSizeMb, onUpload]
  );

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handle(e.dataTransfer.files);
        }}
        className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handle(e.target.files)}
          className="hidden"
        />
        <p className="text-sm text-gray-600">
          {busy ? 'Yükleniyor…' : 'Dosyaları buraya sürükle veya tıkla'}
        </p>
        <p className="text-xs text-gray-400 mt-1">Maks {maxSizeMb}MB / dosya</p>
      </label>
      {list.length > 0 && (
        <ul className="mt-3 text-sm space-y-1">
          {list.map((f, i) => (
            <li key={i} className="flex justify-between">
              <span>{f.name}</span>
              <span className="text-gray-500">{Math.round(f.size / 1024)} KB</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
