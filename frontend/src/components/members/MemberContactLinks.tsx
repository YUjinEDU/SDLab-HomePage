import type { Member } from "@/types";

type Props = {
  email: string | null;
  links: Member["links"];
};

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const linkConfig: {
  key: keyof NonNullable<Member["links"]>;
  label: string;
}[] = [
  { key: "github", label: "GitHub" },
  { key: "scholar", label: "Google Scholar" },
  { key: "homepage", label: "홈페이지" },
  { key: "orcid", label: "ORCID" },
  { key: "dblp", label: "DBLP" },
];

export function MemberContactLinks({ email, links }: Props) {
  const hasLinks = email || Object.values(links).some(Boolean);
  if (!hasLinks) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-sm text-text-secondary hover:text-primary hover:border-primary transition-colors"
        >
          <MailIcon />
          <span>{email}</span>
        </a>
      )}
      {linkConfig.map(({ key, label }) => {
        const href = links[key];
        if (!href) return null;
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-sm text-text-secondary hover:text-primary hover:border-primary transition-colors"
          >
            <span>{label}</span>
            <ExternalIcon />
          </a>
        );
      })}
    </div>
  );
}
