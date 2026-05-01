import {
  AlertTriangle,
  CarFront,
  CheckCircle2,
  Lock,
  MessageCircle,
  Palette,
  Shield,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getVehicleByToken } from "../../../../lib/safeSafarData";
import { ContactRequestForm } from "./ContactRequestForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
};

const detailIconClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm";

function StatusPage({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: "warning" | "error";
}) {
  const isWarning = tone === "warning";

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/40 to-background px-4 py-28 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto max-w-xl rounded-3xl border border-border/60 bg-card p-6 text-center shadow-2xl shadow-primary/5 sm:p-10">
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${
            isWarning ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
          }`}
        >
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="mb-4 text-3xl tracking-tight sm:text-4xl">{title}</h1>
        <p className="mb-8 text-muted-foreground">{description}</p>
        <Link
          href="/scan"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-accent px-6 py-3 text-accent-foreground shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl"
        >
          Back to Scanner
        </Link>
      </section>
    </main>
  );
}

export default async function VehicleTokenPage({ params }: PageProps) {
  const { token } = await params;
  const result = await getVehicleByToken(decodeURIComponent(token));

  if (result.state === "invalid") {
    return (
      <StatusPage
        tone="error"
        title="Invalid Safe Safar QR"
        description="This QR code does not match an existing Safe Safar vehicle."
      />
    );
  }

  if (result.state === "inactive") {
    return (
      <StatusPage
        tone="warning"
        title="Safe Safar QR is inactive"
        description="This sticker has not been activated yet. Please check again after delivery is confirmed."
      />
    );
  }

  const { vehicle } = result;
  const ownerFields = [
    { icon: User, label: "Owner Name", value: vehicle.ownerName },
    { icon: Palette, label: "Car Color", value: vehicle.carColor },
    { icon: CarFront, label: "Car Brand", value: vehicle.carBrand },
    { icon: Shield, label: "Car Model", value: vehicle.carModel },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/40 to-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-4xl flex-col">
        <section className="flex flex-1 items-center py-8">
          <div className="w-full">
            <header className="mb-6 text-center sm:mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-accent">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Safe Safar Vehicle</span>
              </div>

              <h1 className="mb-3 text-3xl tracking-tight sm:text-4xl md:text-5xl">
                Car Owner Information
              </h1>
              <p className="text-muted-foreground">
                Send a contact request without exposing private phone numbers.
              </p>

              <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-2xl border border-primary/10 bg-white/80 px-4 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur">
                <Lock className="h-4 w-4 shrink-0 text-accent" />
                <span>Phone number protected by Safe Safar</span>
              </div>
            </header>

            <section
              aria-labelledby="owner-details-heading"
              className="rounded-3xl border border-border/60 bg-card p-4 shadow-2xl shadow-primary/5 sm:p-6 md:p-8"
            >
              <div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Shield className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 id="owner-details-heading" className="text-xl sm:text-2xl">
                      Verified Vehicle Details
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Use this information only when necessary.
                    </p>
                  </div>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <CarFront className="h-4 w-4" />
                  <span>{vehicle.numberPlate}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {ownerFields.map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center gap-4 rounded-2xl border border-border/50 bg-secondary/30 p-4"
                  >
                    <div className={detailIconClass}>
                      <field.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase text-muted-foreground">
                        {field.label}
                      </p>
                      <p className="truncate text-base sm:text-lg">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-5 rounded-3xl border border-border/60 bg-white/80 p-4 shadow-xl shadow-primary/5 backdrop-blur sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl">Contact Owner</h2>
                  <p className="text-sm text-muted-foreground">
                    Safe Safar will store your request for the owner to review.
                  </p>
                </div>
              </div>
              <ContactRequestForm vehicleId={vehicle.vehicleId} />
            </section>

            <section
              aria-labelledby="emergency-heading"
              className="mt-5 rounded-3xl border border-destructive/10 bg-card p-4 shadow-xl shadow-primary/5 sm:p-6"
            >
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="emergency-heading" className="text-xl">
                    Emergency Contacts
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Contact details stay protected. Include urgency in the request above.
                  </p>
                </div>
              </div>

              {vehicle.emergencyContacts.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {vehicle.emergencyContacts.map((contact) => (
                    <article
                      key={contact.id}
                      className="rounded-2xl border border-border/60 bg-secondary/30 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {contact.relationship ?? "Emergency contact"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-xl bg-accent/10 px-3 py-3 text-sm text-accent">
                        Phone number protected by Safe Safar
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 text-sm text-muted-foreground">
                  No emergency contacts are listed for this vehicle.
                </div>
              )}
            </section>

            <section className="mt-5 rounded-3xl border border-accent/15 bg-accent/10 p-5 text-center">
              <p className="text-sm text-foreground">
                This vehicle is connected through a privacy-first contact system.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use only for emergencies and parking-related communication.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
