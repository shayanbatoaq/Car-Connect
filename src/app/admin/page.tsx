"use client";

import {
  AlertTriangle,
  Download,
  Lock,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

const ADMIN_STATUSES = [
  "pending",
  "confirmed",
  "printed",
  "shipped",
  "delivered",
  "active",
  "cancelled",
] as const;

type AdminOrder = {
  id: string;
  amount: number;
  paymentMethod: string;
  addressLine1: string;
  addressLine2: string | null;
  postcode: string;
  city: string;
  orderStatus: string;
  subscriptionStatus: string;
  createdAt: string;
  customer: {
    full_name: string;
    email: string | null;
    phone: string;
  } | null;
  vehicle: {
    id: string;
    car_color: string;
    car_brand: string;
    car_model: string;
    number_plate: string;
    qr_token: string;
    status: string;
  } | null;
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string | null;
    phone: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusClass(status: string) {
  if (status === "active") {
    return "bg-accent/10 text-accent border-accent/20";
  }

  if (status === "cancelled") {
    return "bg-destructive/10 text-destructive border-destructive/20";
  }

  return "bg-secondary text-muted-foreground border-border";
}

function formatPaymentMethod(value: string) {
  return value === "cash_on_delivery" ? "Cash on Delivery" : value;
}

function getOrderSearchText(order: AdminOrder) {
  return [
    order.id,
    order.orderStatus,
    order.subscriptionStatus,
    order.paymentMethod,
    order.city,
    order.postcode,
    order.addressLine1,
    order.addressLine2,
    order.customer?.full_name,
    order.customer?.email,
    order.customer?.phone,
    order.vehicle?.car_color,
    order.vehicle?.car_brand,
    order.vehicle?.car_model,
    order.vehicle?.number_plate,
    ...order.emergencyContacts.flatMap((contact) => [
      contact.name,
      contact.relationship,
      contact.phone,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchTerm = searchQuery.trim().toLowerCase();
  const filteredOrders = useMemo(() => {
    if (!searchTerm) {
      return orders;
    }

    return orders.filter((order) => getOrderSearchText(order).includes(searchTerm));
  }, [orders, searchTerm]);
  const hasSearchQuery = searchTerm.length > 0;

  const fetchOrders = async (adminPassword = password) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/orders", {
        headers: {
          "x-admin-password": adminPassword,
        },
        cache: "no-store",
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Could not load admin orders.");
      }

      setOrders(Array.isArray(result.orders) ? result.orders : []);
      setIsUnlocked(true);
      window.sessionStorage.setItem("safe-safar-admin-password", adminPassword);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not load admin orders."
      );
      setIsUnlocked(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedPassword = window.sessionStorage.getItem(
      "safe-safar-admin-password"
    );

    if (savedPassword) {
      setPassword(savedPassword);
      void fetchOrders(savedPassword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void fetchOrders(password);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setBusyOrderId(orderId);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Could not update order status.");
      }

      await fetchOrders(password);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not update order status."
      );
    } finally {
      setBusyOrderId(null);
    }
  };

  const deleteBooking = async (order: AdminOrder) => {
    const customerName = order.customer?.full_name ?? "this booking";
    const confirmed = window.confirm(
      `Delete booking for ${customerName}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingOrderId(order.id);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": password,
        },
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Could not delete booking.");
      }

      setOrders((currentOrders) =>
        currentOrders.filter((currentOrder) => currentOrder.id !== order.id)
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not delete booking."
      );
    } finally {
      setDeletingOrderId(null);
    }
  };

  const printSticker = async (vehicleId: string) => {
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/admin/sticker/${vehicleId}`, {
        headers: {
          "x-admin-password": password,
        },
      });
      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok) {
        const result = contentType.includes("application/json")
          ? await response.json()
          : { error: await response.text() };
        throw new Error(result.error ?? "Could not generate sticker.");
      }

      const html = await response.text();
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        throw new Error("Popup blocked. Please allow popups to print stickers.");
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not generate sticker."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>Safe Safar Admin</span>
            </div>
            <h1 className="text-3xl tracking-tight sm:text-4xl">
              Order Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage COD orders, sticker printing, and QR activation.
            </p>
          </div>

          {isUnlocked && (
            <button
              type="button"
              onClick={() => void fetchOrders(password)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-3 text-sm shadow-sm transition-shadow hover:shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          )}
        </header>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/15 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!isUnlocked ? (
          <section className="mx-auto max-w-md rounded-3xl border border-border/60 bg-card p-6 shadow-2xl shadow-primary/5 sm:p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-2xl">Admin Password</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Enter the MVP admin password from your environment variables.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-12 w-full rounded-2xl border border-border bg-secondary/50 px-4 outline-none transition-colors focus:border-primary/40 focus:bg-white"
                placeholder="ADMIN_PASSWORD"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-accent px-5 text-accent-foreground shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Checking..." : "Open Dashboard"}
              </button>
            </form>
          </section>
        ) : (
          <section className="space-y-5">
            <div className="rounded-3xl border border-border/60 bg-card p-4 shadow-xl shadow-primary/5 sm:p-5">
              <label
                htmlFor="admin-booking-search"
                className="mb-2 block text-sm text-muted-foreground"
              >
                Search bookings
              </label>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="admin-booking-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-border bg-white py-3 pl-11 pr-12 text-sm outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    placeholder="Name, phone, plate, city, order ID..."
                  />
                  {hasSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      aria-label="Clear booking search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="shrink-0 text-sm text-muted-foreground">
                  {hasSearchQuery
                    ? `${filteredOrders.length} of ${orders.length} bookings`
                    : `${orders.length} bookings`}
                </p>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-xl shadow-primary/5">
                <PackageCheck className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <h2 className="text-2xl">
                  {hasSearchQuery ? "No matching bookings" : "No orders yet"}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {hasSearchQuery
                    ? "Try another name, phone number, plate, city, or order ID."
                    : "New Safe Safar signup orders will appear here."}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isDeleting = deletingOrderId === order.id;
                const isOrderBusy = busyOrderId === order.id || isDeleting;

                return (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-border/60 bg-card p-4 shadow-xl shadow-primary/5 sm:p-6"
                  >
                    <div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <p className="mb-2 break-all font-mono text-xs text-muted-foreground">
                          {order.id}
                        </p>
                        <h2 className="text-2xl">
                          {order.customer?.full_name ?? "Unknown customer"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Created {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        {order.vehicle?.id && (
                          <button
                            type="button"
                            onClick={() => void printSticker(order.vehicle!.id)}
                            disabled={isOrderBusy}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm text-accent-foreground shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <Download className="h-4 w-4" />
                            Download/Print Sticker
                          </button>
                        )}
                        <select
                          value={order.orderStatus}
                          onChange={(event) =>
                            void updateOrderStatus(order.id, event.target.value)
                          }
                          disabled={isOrderBusy}
                          className="h-12 rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {ADMIN_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => void deleteBooking(order)}
                          disabled={isOrderBusy}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 px-5 py-3 text-sm text-destructive transition-colors hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <Trash2 className="h-4 w-4" />
                          {isDeleting ? "Deleting..." : "Delete Booking"}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                      <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                        <h3 className="mb-3 text-sm uppercase text-muted-foreground">
                          Customer
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>Phone: {order.customer?.phone ?? "N/A"}</p>
                          <p>Email: {order.customer?.email ?? "N/A"}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                        <h3 className="mb-3 text-sm uppercase text-muted-foreground">
                          Vehicle
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>Color: {order.vehicle?.car_color ?? "N/A"}</p>
                          <p>Brand: {order.vehicle?.car_brand ?? "N/A"}</p>
                          <p>Model: {order.vehicle?.car_model ?? "N/A"}</p>
                          <p>Plate: {order.vehicle?.number_plate ?? "N/A"}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                        <h3 className="mb-3 text-sm uppercase text-muted-foreground">
                          Delivery
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>{order.addressLine1}</p>
                          {order.addressLine2 && <p>{order.addressLine2}</p>}
                          <p>
                            {order.city}, {order.postcode}
                          </p>
                          <p>Amount: Rs. {order.amount}</p>
                          <p>Payment: {formatPaymentMethod(order.paymentMethod)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl border border-border/60 bg-white p-4">
                        <h3 className="mb-3 text-sm uppercase text-muted-foreground">
                          Status
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-sm ${statusClass(
                              order.orderStatus
                            )}`}
                          >
                            Order: {order.orderStatus}
                          </span>
                          <span
                            className={`rounded-full border px-3 py-1.5 text-sm ${statusClass(
                              order.subscriptionStatus
                            )}`}
                          >
                            Subscription: {order.subscriptionStatus}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/60 bg-white p-4">
                        <h3 className="mb-3 text-sm uppercase text-muted-foreground">
                          Emergency Contacts
                        </h3>
                        {order.emergencyContacts.length > 0 ? (
                          <div className="space-y-2 text-sm">
                            {order.emergencyContacts.map((contact) => (
                              <p key={contact.id}>
                                {contact.name}
                                {contact.relationship
                                  ? ` (${contact.relationship})`
                                  : ""}:{" "}
                                {contact.phone}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No emergency contacts.
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        )}
      </div>
    </main>
  );
}
