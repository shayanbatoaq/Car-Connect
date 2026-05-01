"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  CarFront,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Lock,
  Mail,
  MapPin,
  Palette,
  Shield,
  Siren,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

const mockOwner = {
  fullName: "Ali Khan",
  email: "alikhan@example.com",
  carColor: "White",
  carBrand: "Toyota",
  carModel: "Corolla Altis",
  numberPlate: "ABC-123",
  city: "Karachi",
};

const emergencyContacts = [
  {
    name: "Ahmed Khan",
    relation: "Brother",
  },
  {
    name: "Sara Khan",
    relation: "Wife",
  },
  {
    name: "Hamza Malik",
    relation: "Friend",
  },
  {
    name: "Imran Shah",
    relation: "Driver / Assistant",
  },
];

const ownerFields = [
  { icon: User, label: "Full Name", value: mockOwner.fullName },
  { icon: Mail, label: "Email", value: mockOwner.email },
  { icon: Palette, label: "Car Color", value: mockOwner.carColor },
  { icon: CarFront, label: "Car Brand", value: mockOwner.carBrand },
  { icon: Droplets, label: "Car Model", value: mockOwner.carModel },
  { icon: MapPin, label: "City", value: mockOwner.city },
];

export function DemoPage() {
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/40 to-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-4xl flex-col">
        <section className="flex flex-1 items-center py-8">
          <div className="w-full">
            <motion.header
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 text-center sm:mb-8"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-accent">
                <CheckCircle2 className="h-4 w-4" />
                <span>Vehicle Contact Page</span>
              </div>

              <h1 className="mb-3 text-3xl tracking-tight sm:text-4xl md:text-5xl">
                Car Owner Information
              </h1>
              <p className="text-muted-foreground">
                Scan verified. Contact details below.
              </p>

              <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-2xl border border-primary/10 bg-white/80 px-4 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur">
                <Lock className="h-4 w-4 shrink-0 text-accent" />
                <span>Phone number hidden for privacy</span>
              </div>
            </motion.header>

            <motion.section
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
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
                  <span>{mockOwner.numberPlate}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {ownerFields.map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center gap-4 rounded-2xl border border-border/50 bg-secondary/30 p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                      <field.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {field.label}
                      </p>
                      <p className="truncate text-base sm:text-lg">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              aria-label="Contact actions"
              className="mt-5 rounded-3xl border border-border/60 bg-white/80 p-4 shadow-xl shadow-primary/5 backdrop-blur sm:p-6"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Send contact request"
                  className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-accent px-6 py-4 text-accent-foreground shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl"
                >
                  <Lock className="h-5 w-5" />
                  <span>Contact Request</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-controls="emergency-contacts"
                  aria-expanded={showEmergencyContacts}
                  onClick={() => setShowEmergencyContacts((current) => !current)}
                  className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-6 py-4 text-destructive transition-colors hover:bg-destructive/15"
                >
                  <Siren className="h-5 w-5" />
                  <span>Emergency</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      showEmergencyContacts ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>
              </div>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Requests are sent without displaying private numbers.
              </p>
            </motion.section>

            <AnimatePresence initial={false}>
              {showEmergencyContacts && (
                <motion.section
                  id="emergency-contacts"
                  initial={{ height: 0, opacity: 0, y: -8 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="overflow-hidden"
                  aria-labelledby="emergency-heading"
                >
                  <div className="mt-5 rounded-3xl border border-destructive/10 bg-card p-4 shadow-xl shadow-primary/5 sm:p-6">
                    <div className="mb-5 flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 id="emergency-heading" className="text-xl">
                          Emergency Contacts
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Numbers remain hidden in this template.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {emergencyContacts.map((contact) => (
                        <article
                          key={`${contact.name}-${contact.relation}`}
                          className="rounded-2xl border border-border/60 bg-secondary/30 p-4"
                        >
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
                              <Users className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate text-lg">{contact.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {contact.relation}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-xl border border-accent/20 bg-accent/10 px-3 py-3 text-center text-sm text-accent">
                            Phone number protected by Safe Safar
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="mt-5 rounded-3xl border border-accent/15 bg-accent/10 p-5 text-center"
            >
              <p className="text-sm text-foreground">
                This vehicle is connected through a privacy-first contact system.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use only for emergencies and parking-related communication.
              </p>
            </motion.section>
          </div>
        </section>

        <footer className="border-t border-border/60 py-5 text-center text-sm text-muted-foreground">
          <p className="mb-1 text-foreground">Safe Safar / Car Can</p>
          <p>For emergencies and parking-related communication only.</p>
        </footer>
      </div>
    </main>
  );
}
