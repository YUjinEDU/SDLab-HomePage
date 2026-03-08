import { ExternalLinkButton } from "@/components/shared/ExternalLinkButton";

type PublicationExternalLinksProps = {
  doi: string | null;
  pdfUrl: string | null;
};

export function PublicationExternalLinks({
  doi,
  pdfUrl,
}: PublicationExternalLinksProps) {
  const doiUrl = doi ? `https://doi.org/${doi}` : null;
  const hasLinks = doiUrl || pdfUrl;

  if (!hasLinks) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {pdfUrl && <ExternalLinkButton href={pdfUrl} label="PDF 다운로드" />}
      {doiUrl && <ExternalLinkButton href={doiUrl} label="DOI 링크" />}
    </div>
  );
}
