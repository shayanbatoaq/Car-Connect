import { getVehicleByToken } from "../../../../../lib/safeSafarData";
import { jsonError } from "../../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { token } = await params;
    const result = await getVehicleByToken(decodeURIComponent(token));

    if (result.state === "invalid") {
      return Response.json({ error: "Invalid Safe Safar QR." }, { status: 404 });
    }

    if (result.state === "inactive") {
      return Response.json(
        { error: "This Safe Safar QR is not active yet." },
        { status: 403 }
      );
    }

    return Response.json({ vehicle: result.vehicle });
  } catch (error) {
    return jsonError(error);
  }
}
