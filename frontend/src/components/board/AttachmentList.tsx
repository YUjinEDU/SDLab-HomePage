type Attachment = {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number | null;
};

type Props = { attachments: Attachment[] };

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentList({ attachments }: Props) {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <p className="text-xs font-semibold text-gray-500 mb-2">
        첨부파일 ({attachments.length})
      </p>
      <ul className="flex flex-col gap-1">
        {attachments.map((f) => (
          <li key={f.id}>
            <a
              href={`/api/board-download?path=${encodeURIComponent(f.filePath)}`}
              className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 hover:underline"
              download={f.fileName}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {f.fileName}
              {f.fileSize && (
                <span className="text-gray-400 text-xs">
                  ({formatSize(f.fileSize)})
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
