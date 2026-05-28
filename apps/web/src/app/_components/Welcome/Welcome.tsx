"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Botbar } from "./Chrome";
import { Composition, type Choice } from "./Composition";
import { Transition } from "./Transition";
import styles from "./Welcome.module.css";
import { Nav } from "../Nav";
import { NavVariant } from "../Nav/variants";
import { ROUTES } from "@/configs/constants";

const TRANSITION_MS = 1100;

export function Welcome() {
  const router = useRouter();
  const [hover, setHover] = useState<Choice | null>(null);
  const [selected, setSelected] = useState<Choice | null>(null);
  const [busy, setBusy] = useState(false);
  const hoverRef = useRef<Choice | null>(null);
  hoverRef.current = hover;
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current !== null) {
        clearTimeout(navTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const root = document.body;
    root.setAttribute("data-vignette", "on");
    root.setAttribute("data-welcome", "true");
    return () => {
      root.removeAttribute("data-vignette");
      root.removeAttribute("data-welcome");
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    document.body.removeAttribute("data-vignette");
  }, [selected]);

  useEffect(() => {
    router.prefetch(ROUTES.work);
    router.prefetch(ROUTES.life);
  }, [router]);

  const onHover = useCallback(
    (which: Choice | null) => {
      if (busy) return;
      setHover(which);
    },
    [busy],
  );

  const onSelect = useCallback(
    (which: Choice) => {
      if (busy) return;
      setBusy(true);
      setSelected(which);

      // Trigger the background fade by removing the data-welcome attribute
      document.body.removeAttribute("data-welcome");

      navTimeoutRef.current = setTimeout(() => {
        router.push(ROUTES[which]);
      }, TRANSITION_MS);
    },
    [busy, router],
  );

  const bgRef = useRef<HTMLDivElement>(null);
  const compRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf: number | null = null;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const COMP_FACTOR = 0.4;
    const SHADOW_FACTOR = 0.2;
    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      const bg = bgRef.current;
      const comp = compRef.current;
      if (bg) {
        bg.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      }
      if (comp) {
        comp.style.transform = `translate3d(${(current.x * COMP_FACTOR).toFixed(2)}px, ${(current.y * COMP_FACTOR).toFixed(2)}px, 0)`;
        comp.style.setProperty(
          "--shadow-x",
          `${(current.x * SHADOW_FACTOR).toFixed(2)}px`,
        );
        comp.style.setProperty(
          "--shadow-y",
          `${(current.y * SHADOW_FACTOR).toFixed(2)}px`,
        );
      }
      if (
        Math.abs(target.x - current.x) > 0.05 ||
        Math.abs(target.y - current.y) > 0.05
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      target.x = -((e.clientX - w / 2) / (w / 2)) * 30;
      target.y = -((e.clientY - h / 2) / (h / 2)) * 30;
      if (raf === null) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        onHover("work");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        onHover("life");
      } else if (e.key === "1") {
        onHover("work");
      } else if (e.key === "2") {
        onHover("life");
      } else if (e.key === "Enter") {
        onSelect(hoverRef.current || "work");
      } else if (e.key === "Escape") {
        onHover(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onHover, onSelect]);

  return (
    <div className="relative h-screen w-screen overflow-hidden text-fg antialiased">
      <div ref={bgRef} className={styles.bgWrap}>
        <div className={styles.paper}></div>
        <div
          className={`${styles.paperOverlayBottom} ${hover === "work" ? styles.paperOverlayOn : ""}`}
        ></div>
        <div
          className={`${styles.paperOverlayTop} ${hover === "life" ? styles.paperOverlayOn : ""}`}
        ></div>
      </div>

      <div className="relative grid h-screen w-screen grid-rows-[auto_1fr_auto]">
        <Nav variant={NavVariant.WELCOME} />
        <main className="relative flex items-center justify-center">
          <div ref={compRef} className={styles.compWrap}>
            <Composition
              hover={hover}
              selected={selected}
              onHover={onHover}
              onSelect={onSelect}
              copy={{ work: "Work", life: "Life" }}
            />
          </div>
        </main>
        <Botbar />
      </div>

      <Transition selected={selected} />
    </div>
  );
}
