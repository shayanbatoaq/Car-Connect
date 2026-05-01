import {
  getSupabaseAdmin,
  isAdminRequestAuthorized,
  jsonError,
} from "../../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function firstRelation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function GET(request: Request) {
  // TODO: Replace this MVP password check with real admin authentication.
  try {
    if (!isAdminRequestAuthorized(request)) {
      return Response.json({ error: "Invalid admin password." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        "id, customer_id, vehicle_id, amount, payment_method, address_line_1, address_line_2, postcode, city, order_status, subscription_status, created_at, updated_at, customers(id, full_name, email, phone), vehicles(id, car_color, car_brand, car_model, number_plate, qr_token, status)"
      )
      .order("created_at", { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    const customerIds = Array.from(
      new Set((orders ?? []).map((order) => order.customer_id).filter(Boolean))
    );

    const { data: emergencyContacts, error: contactsError } = customerIds.length
      ? await supabase
          .from("emergency_contacts")
          .select("id, customer_id, name, relationship, phone")
          .in("customer_id", customerIds)
          .order("created_at", { ascending: true })
      : { data: [], error: null };

    if (contactsError) {
      throw contactsError;
    }

    const contactsByCustomer = new Map<string, typeof emergencyContacts>();

    for (const contact of emergencyContacts ?? []) {
      const current = contactsByCustomer.get(contact.customer_id) ?? [];
      current.push(contact);
      contactsByCustomer.set(contact.customer_id, current);
    }

    const formattedOrders = (orders ?? []).map((order) => {
      const customer = firstRelation<{
        id: string;
        full_name: string;
        email: string | null;
        phone: string;
      }>(order.customers);
      const vehicle = firstRelation<{
        id: string;
        car_color: string;
        car_brand: string;
        car_model: string;
        number_plate: string;
        qr_token: string;
        status: string;
      }>(order.vehicles);

      return {
        id: order.id,
        amount: order.amount,
        paymentMethod: order.payment_method,
        addressLine1: order.address_line_1,
        addressLine2: order.address_line_2,
        postcode: order.postcode,
        city: order.city,
        orderStatus: order.order_status,
        subscriptionStatus: order.subscription_status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        customer,
        vehicle,
        emergencyContacts: contactsByCustomer.get(order.customer_id) ?? [],
      };
    });

    return Response.json({ orders: formattedOrders });
  } catch (error) {
    return jsonError(error);
  }
}
