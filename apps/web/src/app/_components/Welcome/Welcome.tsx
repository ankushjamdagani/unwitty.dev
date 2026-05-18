"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Botbar } from "./Chrome";
import { Composition, type Choice } from "./Composition";
import { Transition } from "./Transition";
import styles from "./Welcome.module.css";
import { Nav } from "../Nav2";

const ROUTES: Record<Choice, string> = {
  work: "/work",
  life: "/life",
};

const TRANSITION_MS = 1100;

export function Welcome() {
  const router = useRouter();
  const [hover, setHover] = useState<Choice | null>(null);
  const [selected, setSelected] = useState<Choice | null>(null);
  const [busy, setBusy] = useState(false);
  const hoverRef = useRef<Choice | null>(null);
  hoverRef.current = hover;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

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
      setTimeout(() => {
        router.push(ROUTES[which]);
      }, TRANSITION_MS);
    },
    [busy, router],
  );

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
    <div className="relative h-screen w-screen overflow-hidden bg-paper font-mono-display text-ink antialiased">
      <div className={styles.paper}></div>
      <div className={styles.grain}></div>

      <div className="relative grid h-screen w-screen grid-rows-[auto_1fr_auto]">
        <Nav />
        <main className="relative flex items-center justify-center">
          <Composition
            hover={hover}
            selected={selected}
            onHover={onHover}
            onSelect={onSelect}
            copy={{ work: "Work", life: "Life" }}
          />
        </main>
        <Botbar />
      </div>

      <Transition selected={selected} />
    </div>
  );
}
