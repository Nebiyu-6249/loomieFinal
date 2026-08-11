"use client";

import { useSyncExternalStore } from "react";

import { REDUCED_MOTION_QUERY } from "@/lib/motion";

/**
 * Whether motion is allowed, read as an external value rather than mirrored
 * into state. The server snapshot is `false`, so the markup that ships is
 * always the static structure and script only ever upgrades it — and a reader
 * who changes the preference in their OS gets the change without a reload.
 */

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useMotionAllowed(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
