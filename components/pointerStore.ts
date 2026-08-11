"use client";

/**
 * One pointer listener and one rAF loop for the whole application.
 *
 * `LoomieEyes` is the only subscriber today, but it was written against a
 * shared store and the shape is worth keeping: any number of marks on a page
 * still costs a single `pointermove` handler and a single frame loop.
 *
 * The loop only runs while there is at least one subscriber, and parks itself
 * when the tab is hidden.
 */

export interface PointerState {
  /** Viewport coordinates of the pointer. */
  x: number;
  y: number;
  /** False until the pointer has moved at least once. */
  seen: boolean;
  /** True for mouse and stylus; false for touch, where tracking makes no sense. */
  fine: boolean;
  /** Milliseconds since the pointer last moved. */
  idleFor: number;
}

type FrameCallback = (time: number, pointer: Readonly<PointerState>) => void;

const state: PointerState = {
  x: 0,
  y: 0,
  seen: false,
  fine: false,
  idleFor: 0,
};

const callbacks = new Set<FrameCallback>();

let frame: number | null = null;
let lastMove = 0;
let listening = false;

const handlePointerMove = (event: PointerEvent) => {
  state.x = event.clientX;
  state.y = event.clientY;
  state.seen = true;
  state.fine = event.pointerType !== "touch";
  lastMove = performance.now();
};

const handleVisibility = () => {
  if (document.hidden) {
    stopLoop();
  } else if (callbacks.size > 0) {
    startLoop();
  }
};

const tick = (time: number) => {
  state.idleFor = state.seen ? time - lastMove : 0;

  callbacks.forEach((callback) => callback(time, state));

  frame = requestAnimationFrame(tick);
};

const startLoop = () => {
  if (frame === null) {
    frame = requestAnimationFrame(tick);
  }
};

const stopLoop = () => {
  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
};

const startListening = () => {
  if (listening) return;
  listening = true;

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
};

const stopListening = () => {
  if (!listening) return;
  listening = false;

  window.removeEventListener("pointermove", handlePointerMove);
  document.removeEventListener("visibilitychange", handleVisibility);
};

/**
 * Registers a per-frame callback. Returns an unsubscribe function; when the
 * last subscriber leaves, the listener and the loop are both torn down.
 */
export function subscribeToPointerFrame(callback: FrameCallback): () => void {
  callbacks.add(callback);

  startListening();
  if (!document.hidden) startLoop();

  return () => {
    callbacks.delete(callback);

    if (callbacks.size === 0) {
      stopLoop();
      stopListening();
    }
  };
}
