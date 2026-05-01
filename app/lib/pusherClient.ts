"use client";

import PusherClient from "pusher-js";

declare global {
  interface Window {
    pusherClient?: PusherClient;
  }
}

export const pusherClient = (() => {
  if (typeof window === "undefined") return null;

  if (!window.pusherClient) {
    window.pusherClient = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY || "",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
      },
    );
  }

  return window.pusherClient;
})();
