"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type Props = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function TiptapEditor({
  content,
  onChange,
  placeholder = "내용을 입력하세요...",
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {[
          {
            label: "B",
            cmd: () => editor.chain().focus().toggleBold().run(),
            active: editor.isActive("bold"),
          },
          {
            label: "I",
            cmd: () => editor.chain().focus().toggleItalic().run(),
            active: editor.isActive("italic"),
          },
          {
            label: "•—",
            cmd: () => editor.chain().focus().toggleBulletList().run(),
            active: editor.isActive("bulletList"),
          },
          {
            label: "1—",
            cmd: () => editor.chain().focus().toggleOrderedList().run(),
            active: editor.isActive("orderedList"),
          },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.cmd}
            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
              btn.active
                ? "bg-emerald-100 text-emerald-700"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="p-3 min-h-[200px] bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
