import Pusher from "pusher";

declare global {
  var pusher: Pusher | undefined;
}

export const pusherServer =
  global.pusher ||
  new Pusher({
    appId: process.env.PUSHER_APP_ID || "",
    cluster: process.env.PUSHER_CLUSTER || "",
    key: process.env.PUSHER_KEY || "",
    secret: process.env.PUSHER_SECRET || "",
    useTLS: true,
  });

if (process.env.NODE_ENV !== "production") {
  global.pusher = pusherServer;
}
