import { useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import type { Project } from "@/lib/projects";

const caseNotes: Record<string, { brief: string; contribution: string; features: string[] }> = {
  "ayyan-khan-portfolio": {
    brief: "Give a graphic designer's varied body of work one clear, memorable home online.",
    contribution: "Designed and built the portfolio website, with a visual hierarchy that puts the client's design work first.",
    features: ["Navigation by design discipline", "Image-led project collections", "Direct email and phone contact"],
  },
  "boost-vertex": {
    brief: "Present a marketing agency's services clearly and give prospective clients an easy way to start a conversation.",
    contribution: "Built the full stack agency website and admin dashboard, connecting the public-facing brand experience with its management interface.",
    features: ["Dedicated marketing service pages", "Case studies and editorial content", "Client inquiry flows and admin dashboard"],
  },
};

export default function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const notes = caseNotes[project.slug];
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="project-dialog-content">
      <button autoFocus className="modal-close" onClick={onClose} aria-label="Close project details"><X size={20} /></button>
      <div className="modal-intro">
        <span className="project-type">{project.type}</span><span className="modal-year">{project.year}</span>
        <h2 id="project-dialog-title">{project.title}</h2>
        <p>{project.longDescription}</p>
        <a className="button button-primary" href={project.liveUrl} target="_blank" rel="noreferrer">Visit live project <ExternalLink size={16} /></a>
      </div>
      {notes && <div className="case-notes"><section><h3>The brief</h3><p>{notes.brief}</p></section><section><h3>My contribution</h3><p>{notes.contribution}</p></section><section><h3>Key features</h3><ul>{notes.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section></div>}
      <div className="project-gallery">{project.gallery.map((image, index) => <figure key={`${project.slug}-${index}`} className="gallery-frame"><a href={image} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} screenshot ${index + 1} at full size`}><img src={image} alt={`${project.title} screen ${index + 1}`} /></a><figcaption>{String(index + 1).padStart(2, "0")} / {index === 0 ? "HOMEPAGE" : project.slug === "boost-vertex" ? "SERVICES" : project.slug === "ayyan-khan-portfolio" ? "DESIGN COLLECTION" : "PROJECT VIEW"} <span>Open full size ↗</span></figcaption></figure>)}</div>
    </div>
  </dialog>;
}
