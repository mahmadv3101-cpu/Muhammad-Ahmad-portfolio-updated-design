/* Design philosophy: reference-grounded neo-editorial terminal minimalism — projects are treated as cinematic case-study cards with acid-lime signals, calm spacing, and purposeful motion. */
import ProjectDialog from "@/components/ProjectDialog";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Project, projects } from "@/lib/projects";

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  return <article className="project-card project-card-enhanced" onClick={() => onOpen(project)} role="button" aria-label={`View ${project.title} project details`} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(project); } }}>
    <div className="project-image"><img loading="lazy" src={project.image} alt={`${project.title} project preview`} /><div className="project-index">{project.year.slice(-2)}</div><span className="project-type">{project.type}</span><span className="project-view">VIEW CASE <ArrowUpRight size={15} /></span></div>
    <div className="project-info"><div><div className="project-meta"><span>{project.category}</span><span className="meta-line" /><span>{project.year}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><span className="project-arrow"><ArrowUpRight size={18} /></span></div>
  </article>;
}

export default function Projects() {
  const [filter, setFilter] = useState<"All" | "Vercel" | "Webflow">("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const visible = useMemo(() => filter === "All" ? projects : projects.filter((project) => project.category === filter), [filter]);
  return <div className="projects-page site-shell theme-dark"><div className="ambient ambient-green" /><div className="ambient ambient-amber" /><div className="grain" />
    <header className="projects-page-header"><Link href="/"><ArrowLeft size={15} /> Back to portfolio</Link><span>MA / PROJECT ARCHIVE</span></header>
    <main className="projects-page-main"><div className="section-kicker"><span>07</span><span>PROJECT ARCHIVE</span><span className="kicker-line" /></div><div className="projects-page-title"><div><p className="eyebrow">A larger field of work.</p><h1>Everything I&apos;ve<br /><em>made useful.</em></h1></div><p>Explore the live builds, campaign pages, product concepts, and Webflow systems behind the portfolio. Open any card for a short case-study note and a visual gallery.</p></div>
      <div className="project-filters"><button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>ALL / {projects.length}</button><button className={filter === "Vercel" ? "active" : ""} onClick={() => setFilter("Vercel")}>VERCEL / {projects.filter((project) => project.category === "Vercel").length}</button><button className={filter === "Webflow" ? "active" : ""} onClick={() => setFilter("Webflow")}>WEBFLOW / {projects.filter((project) => project.category === "Webflow").length}</button></div>
      <section className="archive-group"><div className="archive-grid">{visible.map((project) => <ProjectCard key={project.slug} project={project} onOpen={setSelected} />)}</div></section>
    </main><footer className="footer"><div><span className="footer-mark">MA.</span><span>Built with intent by Muhammad Ahmad.</span></div><a href="https://github.com/mahmadv3101-cpu" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={14} /></a></footer>{selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}</div>;
}
