import { getSupabaseAdmin, normalizeNumberPlate } from "./supabaseAdmin";

export const ADMIN_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "printed",
  "shipped",
  "delivered",
  "active",
  "cancelled",
] as const;

export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export type PublicVehicleData = {
  vehicleId: string;
  ownerName: string;
  carColor: string;
  carBrand: string;
  carModel: string;
  numberPlate: string;
  qrToken: string;
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string | null;
  }>;
};

function firstRelation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function compactPlate(value: string) {
  return value.replace(/[^A-Z0-9]/g, "");
}

function plateCandidates(value: string) {
  const normalized = normalizeNumberPlate(value);
  const compact = compactPlate(normalized);
  const hyphenated = compact.replace(/^([A-Z]+)([0-9]+)$/, "$1-$2");

  return Array.from(new Set([normalized, compact, hyphenated].filter(Boolean)));
}

export async function getVehicleByToken(token: string): Promise<
  | { state: "invalid" }
  | { state: "inactive" }
  | { state: "active"; vehicle: PublicVehicleData }
> {
  const supabase = getSupabaseAdmin();

  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select(
      "id, customer_id, car_color, car_brand, car_model, number_plate, qr_token, status, customers(id, full_name)"
    )
    .eq("qr_token", token)
    .maybeSingle();

  if (vehicleError) {
    throw vehicleError;
  }

  if (!vehicle) {
    return { state: "invalid" };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_status, subscription_status")
    .eq("vehicle_id", vehicle.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    throw orderError;
  }

  const isActive =
    vehicle.status === "active" &&
    order?.order_status === "active" &&
    order?.subscription_status === "active";

  if (!isActive) {
    return { state: "inactive" };
  }

  const { data: emergencyContacts, error: contactsError } = await supabase
    .from("emergency_contacts")
    .select("id, name, relationship")
    .eq("customer_id", vehicle.customer_id)
    .order("created_at", { ascending: true });

  if (contactsError) {
    throw contactsError;
  }

  const customer = firstRelation<{
    id: string;
    full_name: string;
  }>(vehicle.customers);

  return {
    state: "active",
    vehicle: {
      vehicleId: vehicle.id,
      ownerName: customer?.full_name ?? "Safe Safar customer",
      carColor: vehicle.car_color,
      carBrand: vehicle.car_brand,
      carModel: vehicle.car_model,
      numberPlate: vehicle.number_plate,
      qrToken: vehicle.qr_token,
      emergencyContacts: emergencyContacts ?? [],
    },
  };
}

export async function searchActiveVehiclesByPlate(plate: string) {
  const candidates = plateCandidates(plate);

  if (candidates.length === 0) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data: vehicles, error: vehicleError } = await supabase
    .from("vehicles")
    .select("id, qr_token, car_brand, car_model, car_color, number_plate, status")
    .in("number_plate", candidates)
    .eq("status", "active")
    .limit(20);

  if (vehicleError) {
    throw vehicleError;
  }

  if (!vehicles?.length) {
    return [];
  }

  const vehicleIds = vehicles.map((vehicle) => vehicle.id);
  const { data: activeOrders, error: orderError } = await supabase
    .from("orders")
    .select("vehicle_id")
    .in("vehicle_id", vehicleIds)
    .eq("order_status", "active")
    .eq("subscription_status", "active");

  if (orderError) {
    throw orderError;
  }

  const activeVehicleIds = new Set(
    (activeOrders ?? []).map((order) => order.vehicle_id)
  );

  return vehicles
    .filter((vehicle) => activeVehicleIds.has(vehicle.id))
    .map((vehicle) => ({
      token: vehicle.qr_token,
      carBrand: vehicle.car_brand,
      carModel: vehicle.car_model,
      carColor: vehicle.car_color,
      numberPlate: vehicle.number_plate,
    }));
}

export function isAdminOrderStatus(value: unknown): value is AdminOrderStatus {
  return (
    typeof value === "string" &&
    ADMIN_ORDER_STATUSES.includes(value as AdminOrderStatus)
  );
}
