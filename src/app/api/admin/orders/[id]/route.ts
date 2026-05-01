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

export async function DELETE(request: Request, { params }: RouteContext) {
  // TODO: Replace this MVP password check with real admin authentication.
  try {
    if (!isAdminRequestAuthorized(request)) {
      return Response.json({ error: "Invalid admin password." }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getSupabaseAdmin();
    const { data: order, error: orderFetchError } = await supabase
      .from("orders")
      .select("id, customer_id, vehicle_id")
      .eq("id", id)
      .maybeSingle();

    if (orderFetchError) {
      throw orderFetchError;
    }

    if (!order) {
      return Response.json({ error: "Booking not found." }, { status: 404 });
    }

    if (order.vehicle_id) {
      const { error: vehicleDeleteError } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", order.vehicle_id);

      if (vehicleDeleteError) {
        throw vehicleDeleteError;
      }
    } else {
      const { error: orderDeleteError } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);

      if (orderDeleteError) {
        throw orderDeleteError;
      }
    }

    if (order.customer_id) {
      const [
        { count: remainingOrders, error: remainingOrdersError },
        { count: remainingVehicles, error: remainingVehiclesError },
      ] = await Promise.all([
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("customer_id", order.customer_id),
        supabase
          .from("vehicles")
          .select("id", { count: "exact", head: true })
          .eq("customer_id", order.customer_id),
      ]);

      if (remainingOrdersError) {
        throw remainingOrdersError;
      }

      if (remainingVehiclesError) {
        throw remainingVehiclesError;
      }

      if ((remainingOrders ?? 0) === 0 && (remainingVehicles ?? 0) === 0) {
        const { error: customerDeleteError } = await supabase
          .from("customers")
          .delete()
          .eq("id", order.customer_id);

        if (customerDeleteError) {
          throw customerDeleteError;
        }
      }
    }

    return Response.json({ message: "Booking deleted." });
  } catch (error) {
    return jsonError(error);
  }
}
