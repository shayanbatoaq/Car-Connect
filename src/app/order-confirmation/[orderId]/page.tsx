import { ArrowLeft, LifeBuoy, PackageCheck } from "lucide-react";
import Link from "next/link";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export const dynamic = "force-dynamic";

function formatPaymentMethod(value: string | null | undefined) {
  return value === "cash_on_delivery" ? "Cash on Delivery" : value ?? "Cash on Delivery";
}

function formatOrderStatus(value: string | null | undefined) {
  if (!value || value === "pending") {
    return "Pending confirmation";
  }

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params;
  const supabase = getSupabaseAdmin();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, amount, payment_method, order_status")
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background px-4 py-28 text-foreground sm:px-6 lg:px-8">
        <section className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-card p-5 text-center shadow-2xl shadow-primary/5 sm:p-8 md:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <PackageCheck className="h-10 w-10" />
          </div>
          <p className="mb-3 text-sm text-muted-foreground">Order #{orderId}</p>
          <h1 className="mb-4 text-3xl tracking-tight sm:text-4xl">
            Order not found
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
            Please contact Safe Safar support if you believe this order exists.
          </p>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-accent-foreground shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background px-4 py-28 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-card p-5 text-center shadow-2xl shadow-primary/5 sm:p-8 md:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent/10 text-accent">
          <PackageCheck className="h-10 w-10" />
        </div>

        <p className="mb-3 text-sm text-muted-foreground">Order #{orderId}</p>
        <h1 className="mb-4 text-3xl tracking-tight sm:text-4xl">
          Your order is ready
        </h1>
        <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
          Your Safe Safar sticker will be delivered within 5 business days.
        </p>

        <div className="mx-auto mb-8 grid max-w-lg gap-3 text-left">
          <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
            <p className="text-sm text-muted-foreground">Payment method</p>
            <p className="text-lg">{formatPaymentMethod(order.payment_method)}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-lg">Rs. {order.amount ?? 999}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
            <p className="text-sm text-muted-foreground">Order status</p>
            <p className="text-lg">{formatOrderStatus(order.order_status)}</p>
          </div>
        </div>

        <p className="mb-8 text-sm text-muted-foreground">
          Our team will contact you if any details are required.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-accent-foreground shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/#contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-5 py-3 text-primary transition-colors hover:bg-primary/15"
          >
            <LifeBuoy className="h-4 w-4" />
            <span>Contact Support</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
