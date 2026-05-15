export const dynamic = "force-dynamic";

function clean(value) {
  return String(value ?? "").trim();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = clean(searchParams.get("id"));

  if (!id) {
    return new Response("Missing audio id", { status: 400 });
  }

  const driveUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;

  const upstream = await fetch(driveUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    cache: "no-store",
    redirect: "follow",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Cannot load audio from Google Drive", {
      status: upstream.status || 500,
    });
  }

  const contentType = upstream.headers.get("content-type") || "audio/mpeg";

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType.includes("text/html") ? "audio/mpeg" : contentType,
      "Cache-Control": "no-store",
      "Accept-Ranges": "bytes",
    },
  });
}
