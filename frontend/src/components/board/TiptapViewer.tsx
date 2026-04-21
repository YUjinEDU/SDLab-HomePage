"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = { content: string };

export function TiptapViewer({ content }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
    immediatelyRender: false,
  });

  return (
    <div className="prose prose-sm max-w-none text-gray-700">
      <EditorContent editor={editor} />
    </div>
  );
}
