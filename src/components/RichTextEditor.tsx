'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Minus,
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your essay...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-stone max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="w-full px-4 py-3 border border-stone-200 bg-white rounded min-h-[400px] animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-stone-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-stone-200 rounded w-5/6"></div>
      </div>
    );
  }

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-colors ${
        active
          ? 'bg-stone-900 text-white'
          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-stone-200 bg-stone-50 px-4 py-2 flex flex-wrap gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <div className="w-px bg-stone-300 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code size={16} />
        </ToolbarButton>

        <div className="w-px bg-stone-300 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote size={16} />
        </ToolbarButton>

        <div className="w-px bg-stone-300 mx-1"></div>

        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          active={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          active={!editor.isActive('link')}
          title="Remove Link"
        >
          <Minus size={16} />
        </ToolbarButton>

        <div className="flex-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Clear Formatting"
        >
          <span className="text-xs font-bold">Clear</span>
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Word count */}
      <div className="border-t border-stone-200 px-4 py-2 bg-stone-50 text-xs text-stone-500">
        {content.length.toLocaleString()} characters •{' '}
        {content.trim() ? Math.ceil(content.trim().split(/\s+/).length) : 0} words (approx.)
      </div>
    </div>
  );
}
