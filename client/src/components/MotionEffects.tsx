import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { useLocation } from "wouter";

export function AnimatedName() {
  return <h1 aria-label="Muhammad Ahmad" className="animated-name"><span aria-hidden="true">{Array.from("Muhammad").map((letter, index) => <span className="letter-window" key={index}><span style={{ "--letter-delay": `${index * 45 + 100}ms` } as CSSProperties}>{letter}</span></span>)}</span><em aria-hidden="true">{Array.from("Ahmad").map((letter, index) => <span className="letter-window" key={index}><span style={{ "--letter-delay": `${index * 65 + 450}ms` } as CSSProperties}>{letter}</span></span>)}</em></h1>;
}

/** Progressive enhancement: content stays visible if motion is disabled or unavailable. */
export default function MotionEffects() {
  const [location] = useLocation();
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [paused, setPaused] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const enabled = !reduced && !paused;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
    if (!enabled) return;
    const animations = new Set<Animation>();
    const observed = new Set<Element>();
    const animate = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(frames, options);
      animations.add(animation);
      animation.onfinish = () => { animations.delete(animation); animation.cancel(); };
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const index = Array.from(entry.target.parentElement?.children ?? []).indexOf(entry.target);
        const heading = entry.target.matches("h2, h1");
        animate(entry.target, [
          { opacity: 0, transform: `translateY(${heading ? 36 : 24}px)`, filter: heading ? "blur(7px)" : "blur(0px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
        ], { duration: heading ? 900 : 700, delay: Math.min(Math.max(index, 0) * 65, 260), easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
      });
    }, { threshold: .12, rootMargin: "0px 0px -25px 0px" });
    const scan = () => {
      document.querySelectorAll("main h2, .projects-page-title h1, .section-kicker, .project-card, .skill-card, .experience-card, .education-card, .contact-form, .about-copy > p, .stat-row > div, .contact-links > a").forEach(element => {
        if (!observed.has(element)) { observed.add(element); observer.observe(element); }
      });
    };
    scan();
    const mutations = new MutationObserver(scan);
    const main = document.querySelector("main");
    if (main) mutations.observe(main, { childList: true, subtree: true });

    let scrollFrame = 0;
    const updateScroll = () => {
      scrollFrame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const value = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${value})`;
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateScroll();

    let pointerFrame = 0;
    let activeCard: HTMLElement | null = null;
    let lastX = 0;
    let lastY = 0;
    const resetCard = () => {
      if (!activeCard) return;
      activeCard.classList.remove("pointer-active");
      ["--pointer-x", "--pointer-y", "--tilt-x", "--tilt-y"].forEach(property => activeCard?.style.removeProperty(property));
      activeCard = null;
    };
    const updatePointer = () => {
      pointerFrame = 0;
      if (!activeCard) return;
      const bounds = activeCard.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (lastX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (lastY - bounds.top) / bounds.height));
      activeCard.style.setProperty("--pointer-x", `${x * 100}%`);
      activeCard.style.setProperty("--pointer-y", `${y * 100}%`);
      activeCard.style.setProperty("--tilt-x", `${(0.5 - y) * 4}deg`);
      activeCard.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".project-card, .skill-card, .experience-card, .contact-form") : null;
      if (target !== activeCard) { resetCard(); activeCard = target; activeCard?.classList.add("pointer-active"); }
      lastX = event.clientX; lastY = event.clientY;
      if (!pointerFrame && activeCard) pointerFrame = requestAnimationFrame(updatePointer);
    };
    document.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", resetCard);
    window.addEventListener("blur", resetCard);
    return () => {
      observer.disconnect(); mutations.disconnect();
      animations.forEach(animation => animation.cancel());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", resetCard);
      window.removeEventListener("blur", resetCard);
      cancelAnimationFrame(scrollFrame); cancelAnimationFrame(pointerFrame); resetCard();
    };
  }, [enabled, location]);

  return <>
    <div ref={progress} className="reading-progress" aria-hidden="true" />
    <button className="motion-toggle" onClick={() => setPaused(value => !value)} aria-pressed={paused || reduced} disabled={reduced} aria-label={reduced ? "Animations disabled by your device preference" : paused ? "Enable animations" : "Pause animations"} title={reduced ? "Reduced motion preference respected" : paused ? "Enable animations" : "Pause animations"}>{enabled ? <Pause size={13} /> : <Play size={13} />}<span>{enabled ? "Motion on" : "Motion off"}</span></button>
  </>;
}
