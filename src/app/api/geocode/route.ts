import { NextRequest, NextResponse } from "next/server";

interface NominatimAddress {
  amenity?: string;
  shop?: string;
  building?: string;
  road?: string;
  house_number?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  city?: string;
  town?: string;
  county?: string;
}

interface NominatimResponse {
  name?: string;
  display_name?: string;
  address?: NominatimAddress;
}

function isGenericName(name: string): boolean {
  const generic = ["yes", "building", "residential", "commercial", "retail"];
  return generic.includes(name.toLowerCase());
}

function buildLabel(data: NominatimResponse): {
  label: string;
  shortLabel: string;
  detail: string;
} {
  const address = data.address ?? {};
  const city =
    address.city || address.town || address.county || address.suburb || "Bishkek";

  const poi =
    (data.name && !isGenericName(data.name) ? data.name : null) ||
    address.amenity ||
    address.shop ||
    address.building;

  const street = [address.road, address.house_number].filter(Boolean).join(" ");

  const area =
    address.neighbourhood ||
    address.suburb ||
    address.quarter ||
    street ||
    poi;

  const shortLabel = poi || area || city;
  const labelParts = [shortLabel, city].filter(
    (part, index, arr) => part && arr.indexOf(part) === index,
  );

  return {
    shortLabel,
    label: labelParts.join(", "),
    detail: data.display_name ?? labelParts.join(", "),
  };
}

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lng = request.nextUrl.searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1&accept-language=en,ru`,
      {
        headers: {
          "User-Agent": "DRIFT-Hackathon/1.0 (demo app)",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Nominatim request failed");
    }

    const data = (await res.json()) as NominatimResponse;
    const parsed = buildLabel(data);

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({
      label: `${Number(lat).toFixed(4)}°, ${Number(lng).toFixed(4)}°`,
      shortLabel: "Near you",
      detail: `Coordinates: ${lat}, ${lng}`,
    });
  }
}
