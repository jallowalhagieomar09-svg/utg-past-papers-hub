import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/paper-image/$fileId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const fileId = params.fileId;
        if (!fileId || !/^[A-Za-z0-9_-]+$/.test(fileId)) {
          return new Response("Bad file id", { status: 400 });
        }

        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
        const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY;

        let url: string;
        let headers: Record<string, string> = {};

        if (GOOGLE_API_KEY) {
          // Public Drive API (works on any host with files shared "Anyone with link")
          url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&key=${GOOGLE_API_KEY}`;
        } else if (LOVABLE_API_KEY && GOOGLE_DRIVE_API_KEY) {
          // Fallback: Lovable connector gateway (only available on Lovable hosting)
          url = `https://connector-gateway.lovable.dev/google_drive/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`;
          headers = {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": GOOGLE_DRIVE_API_KEY,
          };
        } else {
          return new Response("GOOGLE_API_KEY missing", { status: 500 });
        }

        const res = await fetch(url, { headers });
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
