import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/paper-image/$fileId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const fileId = params.fileId;
        if (!fileId || !/^[A-Za-z0-9_-]+$/.test(fileId)) {
          return new Response("Bad file id", { status: 400 });
        }
        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
        const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
        if (!LOVABLE_API_KEY) return new Response("LOVABLE_API_KEY missing", { status: 500 });
        if (!GOOGLE_DRIVE_API_KEY) return new Response("GOOGLE_DRIVE_API_KEY missing", { status: 500 });

        const url = `https://connector-gateway.lovable.dev/google_drive/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": GOOGLE_DRIVE_API_KEY,
          },
        });
        if (!res.ok) {
          const body = await res.text();
          return new Response(`Drive error ${res.status}: ${body.slice(0, 200)}`, { status: res.status });
        }
        return new Response(res.body, {
          status: 200,
          headers: {
            "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
