import { nanoid } from "nanoid";
import {
  getSupabaseAdmin,
  jsonError,
  normalizeNumberPlate,
} from "../../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

class ValidationError extends Error {
  status = 400;
}

type EmergencyContactInput = {
  name?: unknown;
  relationship?: unknown;
  phone?: unknown;
};

function cleanString(value: unknown) {
  return String(value ?? "").trim();
}

function requireString(body: Record<string, unknown>, key: string, label: string) {
  return requireStringValue(body[key], label);
}

function requireStringValue(rawValue: unknown, label: string) {
  const value = cleanString(rawValue);

  if (!value) {
    throw new ValidationError(`${label} is required.`);
  }

  return value;
}

function toEmergencyContactInput(value: unknown): EmergencyContactInput {
  if (!value || typeof value !== "object") {
    return {};
  }

  return value as EmergencyContactInput;
}

function getEmergencyContacts(body: Record<string, unknown>) {
  const rawContacts = Array.isArray(body.emergencyContacts)
    ? body.emergencyContacts.map(toEmergencyContactInput)
    : [
        {
          name: body.emergencyContact1Name,
          relationship: body.emergencyContact1Relationship,
          phone: body.emergencyContact1Phone,
        },
        {
          name: body.emergencyContact2Name,
          relationship: body.emergencyContact2Relationship,
          phone: body.emergencyContact2Phone,
        },
      ];

  if (rawContacts.length > 5) {
    throw new ValidationError("You can add up to 5 emergency contacts.");
  }

  const contacts = rawContacts
    .map((contact) => ({
      name: cleanString(contact?.name),
      relationship: cleanString(contact?.relationship),
      phone: cleanString(contact?.phone),
    }))
    .filter((contact) => {
      return contact.name || contact.relationship || contact.phone;
    });

  if (contacts.length === 0) {
    throw new ValidationError(
      "At least one emergency contact with name, relationship, and phone number is required."
    );
  }

  for (const contact of contacts) {
    if (!contact.name || !contact.relationship || !contact.phone) {
      throw new ValidationError(
        "Emergency contacts must include a name, relationship, and phone number."
      );
    }
  }

  return contacts;
}

async function generateUniqueQrToken(
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const token = `ssf_${nanoid(14)}`;
    const { data, error } = await supabase
      .from("vehicles")
      .select("id")
      .eq("qr_token", token)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return token;
    }
  }

  throw new Error("Could not generate a unique QR token. Please try again.");
}

export async function POST(request: Request) {
  // TODO: Add rate limiting before production to protect the public signup API.
  let customerId: string | null = null;
  let supabase: ReturnType<typeof getSupabaseAdmin> | null = null;

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const fullName = requireString(body, "fullName", "Full name");
    const email = requireString(body, "email", "Email");
    const phone = requireString(body, "phone", "Phone number");
    const carColor = requireString(body, "carColor", "Car color");
    const carBrand = requireString(body, "carBrand", "Car brand");
    const carModel = requireString(body, "carModel", "Car model");
    const numberPlate = normalizeNumberPlate(
      body.numberPlate ?? body.carNumberPlate
    );
    const addressLine1 = requireString(body, "addressLine1", "Address line 1");
    const addressLine2 = cleanString(body.addressLine2) || null;
    const postcode = requireStringValue(
      body.postcode ?? body.postalCode,
      "Postal code"
    );
    const city = requireString(body, "city", "City");
    const emergencyContacts = getEmergencyContacts(body);

    if (!email.includes("@")) {
      throw new ValidationError("Enter a valid email address.");
    }

    if (!numberPlate) {
      throw new ValidationError("Number plate is required.");
    }

    supabase = getSupabaseAdmin();

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        full_name: fullName,
        email,
        phone,
      })
      .select("id")
      .single();

    if (customerError) {
      throw customerError;
    }

    customerId = customer.id;

    const qrToken = await generateUniqueQrToken(supabase);

    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .insert({
        customer_id: customer.id,
        car_color: carColor,
        car_brand: carBrand,
        car_model: carModel,
        number_plate: numberPlate,
        qr_token: qrToken,
        status: "pending",
      })
      .select("id")
      .single();

    if (vehicleError) {
      throw vehicleError;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customer.id,
        vehicle_id: vehicle.id,
        amount: 999,
        payment_method: "cash_on_delivery",
        address_line_1: addressLine1,
        address_line_2: addressLine2,
        postcode,
        city,
        order_status: "pending",
        subscription_status: "inactive",
      })
      .select("id")
      .single();

    if (orderError) {
      throw orderError;
    }

    if (emergencyContacts.length > 0) {
      const { error: contactsError } = await supabase
        .from("emergency_contacts")
        .insert(
          emergencyContacts.map((contact) => ({
            customer_id: customer.id,
            name: contact.name,
            relationship: contact.relationship,
            phone: contact.phone,
          }))
        );

      if (contactsError) {
        throw contactsError;
      }
    }

    return Response.json(
      {
        orderId: order.id,
        vehicleId: vehicle.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (customerId && supabase) {
      await supabase.from("customers").delete().eq("id", customerId);
    }

    const status = error instanceof ValidationError ? error.status : 500;
    return jsonError(error, status);
  }
}
