import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lng = request.nextUrl.searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      {
        headers: {
          "User-Agent": "DRIFT-Hackathon/1.0 (demo app)",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      throw new Error("Nominatim request failed");
    }

    const data = (await res.json()) as {
      address?: {
        suburb?: string;
        neighbourhood?: string;
        quarter?: string;
        city?: string;
        town?: string;
        county?: string;
      };
    };

    const area =
      data.address?.neighbourhood ||
      data.address?.suburb ||
      data.address?.quarter ||
      data.address?.city ||
      data.address?.town ||
      "Near you";

    const city =
      data.address?.city || data.address?.town || data.address?.county || "";

    const label = city && !area.includes(city) ? `${area}, ${city}` : area;

    return NextResponse.json({ label });
  } catch {
    return NextResponse.json({ label: "Near you" });
  }
}
