'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Plus } from 'lucide-react';

interface ImageUpload {
  file?: File;
  url: string;
  id: string;
}

interface MultipleImageUploadProps {
  images: ImageUpload[];
  onChange: (images: ImageUpload[]) => void;
  maxImages?: number;
  maxSize?: number; // in bytes
}

function SortableImage({
  image,
  onRemove,
}: {
  image: ImageUpload;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-white border border-stone-200 rounded-lg overflow-hidden"
    >
      <div className="relative aspect-video">
        <Image
          src={image.url}
          alt="Upload preview"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            className="p-2 bg-white rounded-full hover:bg-stone-100"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={20} className="text-stone-900" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 bg-red-500 rounded-full hover:bg-red-600"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
      </div>
      {image.file && (
        <div className="px-3 py-2 bg-stone-50 border-t border-stone-200">
          <p className="text-xs text-stone-600 truncate">{image.file.name}</p>
        </div>
      )}
    </div>
  );
}

export default function MultipleImageUpload({
  images,
  onChange,
  maxImages = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
}: MultipleImageUploadProps) {
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      onChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError('');

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} is not an image`);
        return;
      }

      if (file.size > maxSize) {
        invalidFiles.push(`${file.name} exceeds ${maxSize / 1024 / 1024}MB limit`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      setError(invalidFiles.join('. '));
      return;
    }

    const newImages: ImageUpload[] = validFiles.map((file) => {
      const url = URL.createObjectURL(file);
      return {
        file,
        url,
        id: `${Date.now()}-${Math.random()}`,
      };
    });

    onChange([...images, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    const index = images.findIndex((img) => img.id === id);
    if (index !== -1) {
      const image = images[index];
      if (!image.file) {
        // This is an existing image URL, keep it in a separate list for deletion tracking
        // For now, just remove from display
      }
      onChange(images.filter((img) => img.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-stone-900 mb-2">
          Images
        </label>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= maxImages}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 border border-stone-200 text-stone-900 font-medium hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Add Images
          </button>
          <span className="text-sm text-stone-500 self-center">
            {images.length} / {maxImages}
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-2">
          Max {maxImages} images, {maxSize / 1024 / 1024}MB each. Drag to reorder.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onRemove={() => handleRemove(image.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-stone-300 rounded-lg p-12 text-center">
          <p className="text-stone-500">No images added yet</p>
          <p className="text-sm text-stone-400 mt-1">Click "Add Images" to start</p>
        </div>
      )}
    </div>
  );
}
