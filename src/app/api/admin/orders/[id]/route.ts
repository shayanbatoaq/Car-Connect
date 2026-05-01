import {
  getSupabaseAdmin,
  isAdminRequestAuthorized,
  jsonError,
} from "../../../../../../lib/supabaseAdmin";
import { isAdminOrderStatus } from "../../../../../../lib/safeSafarData";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  // TODO: Replace this MVP password check with real admin authentication.
  try {
    if (!isAdminRequestAuthorized(request)) {
      return Response.json({ error: "Invalid admin password." }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const status = body.status;

    if (!isAdminOrderStatus(status)) {
      return Response.json({ error: "Invalid order status." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: order, error: orderFetchError } = await supabase
      .from("orders")
      .select("id, vehicle_id")
      .eq("id", id)
      .maybeSingle();

    if (orderFetchError) {
      throw orderFetchError;
    }

    if (!order) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }

    const subscriptionStatus = status === "active" ? "active" : "inactive";
    const vehicleStatus =
      status === "active" ? "active" : status === "cancelled" ? "inactive" : "pending";

    const { error: orderUpdateError } = await supabase
      .from("orders")
      .update({
        order_status: status,
        subscription_status: subscriptionStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (orderUpdateError) {
      throw orderUpdateError;
    }

    const { error: vehicleUpdateError } = await supabase
      .from("vehicles")
      .update({ status: vehicleStatus })
      .eq("id", order.vehicle_id);

    if (vehicleUpdateError) {
      throw vehicleUpdateError;
    }

    return Response.json({
      message: "Order status updated.",
      orderStatus: status,
      subscriptionStatus,
      vehicleStatus,
    });
  } catch (error) {
    return jsonError(error);
  }
}
