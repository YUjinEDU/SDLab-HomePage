import type { ContactInfo } from "@/types/contact";

type Props = {
  info: ContactInfo;
};

export function ContactInfoCard({ info }: Props) {
  const { professor, location } = info;

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">연락처 정보</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
            연구실
          </h3>
          <dl className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
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
                className="shrink-0 mt-0.5 text-text-secondary"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <dt className="sr-only">위치</dt>
                <dd className="text-sm text-text-secondary">
                  {location.building} {location.lab}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
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
                className="shrink-0 mt-0.5 text-text-secondary"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <dt className="sr-only">연구실 전화</dt>
                <dd className="text-sm text-text-secondary">
                  <a
                    href={`tel:042-${location.labPhone}`}
                    className="hover:text-primary transition-colors"
                  >
                    042-{location.labPhone}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
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
                className="shrink-0 mt-0.5 text-text-secondary"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <div>
                <dt className="sr-only">이메일</dt>
                <dd className="text-sm text-text-secondary">
                  <a
                    href={`mailto:${professor.email}`}
                    className="hover:text-primary transition-colors break-all"
                  >
                    {professor.email}
                  </a>
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
            교수실 ({professor.name} {professor.title})
          </h3>
          <dl className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
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
                className="shrink-0 mt-0.5 text-text-secondary"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <dt className="sr-only">위치</dt>
                <dd className="text-sm text-text-secondary">
                  {location.building} {location.professorOffice}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
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
                className="shrink-0 mt-0.5 text-text-secondary"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <dt className="sr-only">교수실 전화</dt>
                <dd className="text-sm text-text-secondary">
                  <a
                    href={`tel:042-${location.professorPhone}`}
                    className="hover:text-primary transition-colors"
                  >
                    042-{location.professorPhone}
                  </a>
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
