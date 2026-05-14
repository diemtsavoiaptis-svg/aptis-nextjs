export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function extractDriveId(value = "") {
  const text = String(value || "");
  const fileMatch = text.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return fileMatch[1];

  const idMatch = text.match(/[?&]id=([^&]+)/);
  if (idMatch) return idMatch[1];

  return text.length > 20 && !text.includes("/") ? text : "";
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUrl = searchParams.get("url") || "";
    const rawId = searchParams.get("id") || "";
    const fileId = extractDriveId(rawId || rawUrl);
    const range = request.headers.get("range");

    if (!fileId && !rawUrl) {
      return new Response("Missing audio", { status: 400 });
    }

    const targetUrl = fileId
      ? `https://drive.google.com/uc?export=download&id=${fileId}`
      : rawUrl;

    const upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        ...(range ? { Range: range } : {}),
      },
      redirect: "follow",
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("Cannot fetch audio", { status: 404 });
    }

    const contentType = upstream.headers.get("content-type") || "audio/mpeg";

    if (contentType.includes("text/html")) {
      return new Response("Google Drive returned HTML, not audio", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "no-store");

    const contentLength = upstream.headers.get("content-length");
    const contentRange = upstream.headers.get("content-range");

    if (contentLength) headers.set("Content-Length", contentLength);
    if (contentRange) headers.set("Content-Range", contentRange);

    return new Response(upstream.body, {
      status: upstream.status === 206 ? 206 : 200,
      headers,
    });
  } catch (error) {
    return new Response("Audio API error: " + error.message, { status: 500 });
  }
}
