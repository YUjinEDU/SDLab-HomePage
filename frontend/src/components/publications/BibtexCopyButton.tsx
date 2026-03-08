"use client";

import type { Publication } from "@/types";
import { CopyButton } from "@/components/shared/CopyButton";

type BibtexCopyButtonProps = {
  publication: Publication;
};

function generateBibtex(pub: Publication): string {
  if (pub.bibtex) return pub.bibtex;

  const key = `${pub.authors[0]?.split(" ").pop() ?? "Author"}${pub.year}`;
  const entryType = pub.type === "journal" ? "article" : "inproceedings";
  const firstAuthor = pub.authors[0] ?? "";
  const authorsFormatted = pub.authors.join(" and ");

  if (pub.type === "journal") {
    return [
      `@${entryType}{${key},`,
      `  author    = {${authorsFormatted}},`,
      `  title     = {${pub.title}},`,
      `  journal   = {${pub.venue}},`,
      `  year      = {${pub.year}},`,
      pub.month != null ? `  month     = {${pub.month}},` : null,
      pub.doi ? `  doi       = {${pub.doi}},` : null,
      `}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `@${entryType}{${key},`,
    `  author    = {${authorsFormatted}},`,
    `  title     = {${pub.title}},`,
    `  booktitle = {${pub.venue}},`,
    `  year      = {${pub.year}},`,
    pub.month != null ? `  month     = {${pub.month}},` : null,
    pub.doi ? `  doi       = {${pub.doi}},` : null,
    `}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function BibtexCopyButton({ publication }: BibtexCopyButtonProps) {
  const bibtex = generateBibtex(publication);
  return <CopyButton text={bibtex} label="BibTeX 복사" />;
}
