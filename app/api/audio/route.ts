import { NextRequest } from "next/server";

function toGoogleDownloadUrl(src: string) {
  if (!src.includes("drive.google.com")) {
    return src;
  }

  if (src.includes("/file/d/")) {
    const id = src.split("/file/d/")[1]?.split("/")[0];
    if (id) {
      return `https://drive.google.com/uc?export=download&id=${id}`;
    }
  }

  if (src.includes("id=")) {
    const id = src.split("id=")[1]?.split("&")[0];
    if (id) {
      return `https://drive.google.com/uc?export=download&id=${id}`;
    }
  }

  return src;
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");

  if (!src) {
    return new Response("Missing audio src", { status: 400 });
  }

  const targetUrl = toGoogleDownloadUrl(src);

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("Cannot fetch audio", { status: 502 });
    }

    const contentType =
      upstream.headers.get("content-type") || "audio/mpeg";

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": 'inline; filename="aptis-audio.mp3"',
        "Cache-Control": "no-store",
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return new Response("Audio proxy error", { status: 500 });
  }
}




