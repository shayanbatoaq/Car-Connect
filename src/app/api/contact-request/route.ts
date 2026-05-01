import { jsonError, getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function cleanString(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  // TODO: Add rate limiting before production to prevent contact request spam.
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const vehicleId = cleanString(body.vehicleId);
    const requesterName = cleanString(body.requesterName) || null;
    const requesterPhone = cleanString(body.requesterPhone) || null;
    const message = cleanString(body.message) || null;

    if (!vehicleId) {
      return Response.json({ error: "Vehicle is required." }, { status: 400 });
    }

    if (!requesterPhone && !message) {
      return Response.json(
        { error: "Please include a phone number or message." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id, status")
      .eq("id", vehicleId)
      .maybeSingle();

    if (vehicleError) {
      throw vehicleError;
    }

    if (!vehicle) {
      return Response.json({ error: "Vehicle not found." }, { status: 404 });
    }

    if (vehicle.status !== "active") {
      return Response.json(
        { error: "This Safe Safar QR is not active yet." },
        { status: 403 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id")
      .eq("vehicle_id", vehicleId)
      .eq("order_status", "active")
      .eq("subscription_status", "active")
      .maybeSingle();

    if (orderError) {
      throw orderError;
    }

    if (!order) {
      return Response.json(
        { error: "This Safe Safar QR is not active yet." },
        { status: 403 }
      );
    }

    const { error: insertError } = await supabase.from("contact_requests").insert({
      vehicle_id: vehicleId,
      requester_name: requesterName,
      requester_phone: requesterPhone,
      message,
      status: "new",
    });

    if (insertError) {
      throw insertError;
    }

    return Response.json({
      message: "Contact request sent successfully.",
    });
  } catch (error) {
    return jsonError(error);
  }
}
