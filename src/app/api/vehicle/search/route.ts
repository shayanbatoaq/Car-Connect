import { searchActiveVehiclesByPlate } from "../../../../../lib/safeSafarData";
import { jsonError, normalizeNumberPlate } from "../../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const plate = normalizeNumberPlate(searchParams.get("plate"));

    if (!plate) {
      return Response.json(
        { error: "Number plate is required.", results: [] },
        { status: 400 }
      );
    }

    const results = await searchActiveVehiclesByPlate(plate);

    if (results.length === 0) {
      return Response.json(
        { error: "No active Safe Safar vehicle found.", results: [] },
        { status: 404 }
      );
    }

    if (results.length === 1) {
      return Response.json({ token: results[0].token, results });
    }

    return Response.json({ results });
  } catch (error) {
    return jsonError(error);
  }
}
