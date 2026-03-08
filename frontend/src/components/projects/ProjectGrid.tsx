import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "@/components/shared/EmptyState";

type ProjectGridProps = {
  projects: Project[];
  emptyMessage?: string;
};

export function ProjectGrid({ projects, emptyMessage }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="프로젝트가 없습니다"
        description={
          emptyMessage ?? "해당 조건에 맞는 프로젝트를 찾을 수 없습니다."
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
