"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Car,
  CheckCircle2,
  MapPin,
  PackageCheck,
  Plus,
  QrCode,
  Shield,
  Trash2,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
};

type SignupFormData = {
  fullName: string;
  email: string;
  phone: string;
  carBrand: string;
  carModel: string;
  carColor: string;
  numberPlate: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  city: string;
  emergencyContacts: EmergencyContact[];
};

const steps = [
  { label: "Personal", title: "Personal Details", icon: User },
  { label: "Vehicle", title: "Car Details", icon: Car },
  { label: "Emergency", title: "Emergency Contacts", icon: Users },
  { label: "Delivery", title: "Delivery + COD", icon: MapPin },
] as const;

const inputClass =
  "h-12 w-full rounded-2xl border border-border bg-input-background px-4 outline-none transition-colors focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10";

const selectClass =
  "h-12 w-full rounded-2xl border border-border bg-input-background px-4 outline-none transition-colors focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10";

function blankContact(id = "primary-contact"): EmergencyContact {
  return {
    id,
    name: "",
    relationship: "",
    phone: "",
  };
}

const initialFormData: SignupFormData = {
  fullName: "",
  email: "",
  phone: "",
  carBrand: "",
  carModel: "",
  carColor: "",
  numberPlate: "",
  addressLine1: "",
  addressLine2: "",
  postcode: "",
  city: "",
  emergencyContacts: [blankContact()],
};

function isBlank(value: string) {
  return value.trim().length === 0;
}

function fieldLabel(text: string, required = true) {
  return (
    <span>
      {text} {required && <span className="text-destructive">*</span>}
    </span>
  );
}

function makeContactId() {
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentStepMeta = steps[currentStep];
  const CurrentStepIcon = currentStepMeta.icon;
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  const updateField = (
    key: Exclude<keyof SignupFormData, "emergencyContacts">,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [key]: key === "numberPlate" ? value.toUpperCase() : value,
    }));
  };

  const updateEmergencyContact = (
    index: number,
    key: keyof Omit<EmergencyContact, "id">,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      emergencyContacts: current.emergencyContacts.map((contact, contactIndex) =>
        contactIndex === index ? { ...contact, [key]: value } : contact
      ),
    }));
  };

  const addEmergencyContact = () => {
    setFormData((current) => {
      if (current.emergencyContacts.length >= 5) {
        return current;
      }

      return {
        ...current,
        emergencyContacts: [
          ...current.emergencyContacts,
          blankContact(makeContactId()),
        ],
      };
    });
  };

  const removeEmergencyContact = (index: number) => {
    setFormData((current) => {
      if (current.emergencyContacts.length <= 1) {
        return current;
      }

      return {
        ...current,
        emergencyContacts: current.emergencyContacts.filter(
          (_contact, contactIndex) => contactIndex !== index
        ),
      };
    });
  };

  const validateStep = (step = currentStep) => {
    if (step === 0) {
      if (isBlank(formData.fullName)) return "Full name is required.";
      if (isBlank(formData.email)) return "Email is required.";
      if (!formData.email.includes("@")) return "Enter a valid email address.";
      if (isBlank(formData.phone)) return "Phone number is required.";
    }

    if (step === 1) {
      if (isBlank(formData.carBrand)) return "Car brand is required.";
      if (isBlank(formData.carModel)) return "Car model is required.";
      if (isBlank(formData.carColor)) return "Car color is required.";
      if (isBlank(formData.numberPlate)) return "Number plate is required.";
    }

    if (step === 2) {
      if (formData.emergencyContacts.length < 1) {
        return "At least one emergency contact is required.";
      }

      if (formData.emergencyContacts.length > 5) {
        return "You can add up to 5 emergency contacts.";
      }

      const incompleteIndex = formData.emergencyContacts.findIndex(
        (contact) =>
          isBlank(contact.name) ||
          isBlank(contact.relationship) ||
          isBlank(contact.phone)
      );

      if (incompleteIndex >= 0) {
        return `Complete emergency contact ${incompleteIndex + 1}.`;
      }
    }

    if (step === 3) {
      if (isBlank(formData.addressLine1)) return "Address line 1 is required.";
      if (isBlank(formData.postcode)) return "Postal code is required.";
      if (isBlank(formData.city)) return "City is required.";
    }

    return null;
  };

  const goNext = () => {
    const validationError = validateStep();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const goBack = () => {
    setErrorMessage(null);
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    for (let step = 0; step < steps.length; step += 1) {
      const validationError = validateStep(step);

      if (validationError) {
        setCurrentStep(step);
        setErrorMessage(validationError);
        return;
      }
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          carBrand: formData.carBrand.trim(),
          carModel: formData.carModel.trim(),
          carColor: formData.carColor.trim(),
          numberPlate: formData.numberPlate.trim().toUpperCase(),
          addressLine1: formData.addressLine1.trim(),
          addressLine2: formData.addressLine2.trim(),
          postcode: formData.postcode.trim(),
          city: formData.city.trim(),
          emergencyContacts: formData.emergencyContacts.map((contact) => ({
            name: contact.name.trim(),
            relationship: contact.relationship.trim(),
            phone: contact.phone.trim(),
          })),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Could not create your Safe Safar order.");
      }

      router.push(`/order-confirmation/${result.orderId}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not create your Safe Safar order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:items-start">
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:block"
          >
            <div className="sticky top-32">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-accent">
                <QrCode className="h-4 w-4" />
                <span>Safe Safar QR Sticker</span>
              </div>

              <h1 className="mb-5 text-5xl tracking-tight lg:text-6xl">
                Join Safe Safar
              </h1>
              <p className="mb-10 max-w-md text-xl leading-relaxed text-muted-foreground">
                Four quick steps. Your physical QR sticker is delivered to your
                address.
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: PackageCheck,
                    title: "Cash on Delivery",
                    text: "Pay Rs. 999 when your sticker arrives.",
                  },
                  {
                    icon: Shield,
                    title: "Privacy Protected",
                    text: "Your private phone number stays hidden.",
                  },
                  {
                    icon: Car,
                    title: "Vehicle Ready",
                    text: "Admin activates the QR after confirmation.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 rounded-3xl border border-border/60 bg-card p-5 shadow-2xl shadow-primary/5">
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15">
                  <QrCode className="h-32 w-32 text-primary/30" />
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.main
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <section className="rounded-3xl border border-border/50 bg-card p-4 shadow-2xl shadow-primary/5 sm:p-6 lg:p-8">
              <div className="mb-6 lg:hidden">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-accent">
                  <QrCode className="h-4 w-4" />
                  <span>Safe Safar QR Sticker</span>
                </div>
                <h1 className="mb-2 text-3xl tracking-tight sm:text-4xl">
                  Join Safe Safar
                </h1>
                <p className="text-sm text-muted-foreground">
                  Complete four quick steps to place your COD order.
                </p>
              </div>

              <div className="mb-6 rounded-2xl border border-border/60 bg-secondary/30 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {steps.length}
                    </p>
                    <h2 className="text-xl sm:text-2xl">{currentStepMeta.title}</h2>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <CurrentStepIcon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mb-4 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isComplete = index < currentStep;

                    return (
                      <div
                        key={step.label}
                        className={`rounded-2xl border px-2 py-3 text-center transition-colors ${
                          isActive
                            ? "border-accent/30 bg-accent/10 text-accent"
                            : isComplete
                              ? "border-primary/15 bg-white text-primary"
                              : "border-border/60 bg-white/70 text-muted-foreground"
                        }`}
                      >
                        <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-current/10">
                          {isComplete ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <p className="truncate text-[11px] sm:text-xs">
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.22 }}
                    className="min-h-[360px]"
                  >
                    {currentStep === 0 && (
                      <div className="grid gap-5">
                        <div>
                          <label htmlFor="fullName" className="mb-2 block text-sm">
                            {fieldLabel("Full Name")}
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={(event) =>
                              updateField("fullName", event.target.value)
                            }
                            className={inputClass}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="mb-2 block text-sm">
                            {fieldLabel("Email")}
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(event) =>
                              updateField("email", event.target.value)
                            }
                            className={inputClass}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="mb-2 block text-sm">
                            {fieldLabel("Phone Number")}
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(event) =>
                              updateField("phone", event.target.value)
                            }
                            className={inputClass}
                            placeholder="+92 300 1234567"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="grid gap-5">
                        <div>
                          <label htmlFor="carBrand" className="mb-2 block text-sm">
                            {fieldLabel("Car Brand")}
                          </label>
                          <select
                            id="carBrand"
                            name="carBrand"
                            value={formData.carBrand}
                            onChange={(event) =>
                              updateField("carBrand", event.target.value)
                            }
                            className={selectClass}
                            required
                          >
                            <option value="">Select brand</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Suzuki">Suzuki</option>
                            <option value="Hyundai">Hyundai</option>
                            <option value="KIA">KIA</option>
                            <option value="Mercedes">Mercedes</option>
                            <option value="BMW">BMW</option>
                            <option value="Audi">Audi</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label htmlFor="carModel" className="mb-2 block text-sm">
                              {fieldLabel("Car Model")}
                            </label>
                            <input
                              id="carModel"
                              name="carModel"
                              value={formData.carModel}
                              onChange={(event) =>
                                updateField("carModel", event.target.value)
                              }
                              className={inputClass}
                              placeholder="e.g., Corolla"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="carColor" className="mb-2 block text-sm">
                              {fieldLabel("Car Color")}
                            </label>
                            <input
                              id="carColor"
                              name="carColor"
                              value={formData.carColor}
                              onChange={(event) =>
                                updateField("carColor", event.target.value)
                              }
                              className={inputClass}
                              placeholder="e.g., White"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="numberPlate" className="mb-2 block text-sm">
                            {fieldLabel("Number Plate")}
                          </label>
                          <input
                            id="numberPlate"
                            name="numberPlate"
                            value={formData.numberPlate}
                            onChange={(event) =>
                              updateField("numberPlate", event.target.value)
                            }
                            className="h-14 w-full rounded-2xl border border-border bg-input-background px-4 text-lg tracking-wide outline-none transition-colors focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10"
                            placeholder="ABC-123"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-5">
                        {formData.emergencyContacts.map((contact, index) => (
                          <div
                            key={contact.id}
                            className="rounded-2xl border border-border/60 bg-secondary/30 p-4"
                          >
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div>
                                <h3 className="text-base">
                                  {index === 0
                                    ? "Primary Contact"
                                    : `Emergency Contact ${index + 1}`}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  Required for urgent situations.
                                </p>
                              </div>

                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => removeEmergencyContact(index)}
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-destructive/20 bg-white text-destructive transition-colors hover:bg-destructive/10"
                                  aria-label={`Remove emergency contact ${index + 1}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>

                            <div className="grid gap-4">
                              <div>
                                <label
                                  htmlFor={`emergency-name-${contact.id}`}
                                  className="mb-2 block text-sm"
                                >
                                  {fieldLabel("Name")}
                                </label>
                                <input
                                  id={`emergency-name-${contact.id}`}
                                  value={contact.name}
                                  onChange={(event) =>
                                    updateEmergencyContact(
                                      index,
                                      "name",
                                      event.target.value
                                    )
                                  }
                                  className="h-12 w-full rounded-2xl border border-border bg-white px-4 outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                  placeholder="Contact name"
                                  required
                                />
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <label
                                    htmlFor={`emergency-relation-${contact.id}`}
                                    className="mb-2 block text-sm"
                                  >
                                    {fieldLabel("Relationship")}
                                  </label>
                                  <input
                                    id={`emergency-relation-${contact.id}`}
                                    value={contact.relationship}
                                    onChange={(event) =>
                                      updateEmergencyContact(
                                        index,
                                        "relationship",
                                        event.target.value
                                      )
                                    }
                                    className="h-12 w-full rounded-2xl border border-border bg-white px-4 outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                    placeholder="Brother, spouse, friend"
                                    required
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`emergency-phone-${contact.id}`}
                                    className="mb-2 block text-sm"
                                  >
                                    {fieldLabel("Phone Number")}
                                  </label>
                                  <input
                                    id={`emergency-phone-${contact.id}`}
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(event) =>
                                      updateEmergencyContact(
                                        index,
                                        "phone",
                                        event.target.value
                                      )
                                    }
                                    className="h-12 w-full rounded-2xl border border-border bg-white px-4 outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                    placeholder="+92 300 1234567"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addEmergencyContact}
                          disabled={formData.emergencyContacts.length >= 5}
                          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-accent/20 bg-accent/10 px-5 py-3 text-accent transition-colors hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Plus className="h-4 w-4" />
                          Add Another Emergency Contact
                        </button>

                        <p className="text-center text-xs text-muted-foreground">
                          {formData.emergencyContacts.length}/5 contacts added
                        </p>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="grid gap-5">
                        <div>
                          <label
                            htmlFor="addressLine1"
                            className="mb-2 block text-sm"
                          >
                            {fieldLabel("Address Line 1")}
                          </label>
                          <input
                            id="addressLine1"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={(event) =>
                              updateField("addressLine1", event.target.value)
                            }
                            className={inputClass}
                            placeholder="House / apartment, street"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="addressLine2"
                            className="mb-2 block text-sm"
                          >
                            {fieldLabel("Address Line 2", false)}
                            <span className="ml-1 text-xs text-muted-foreground">
                              (Optional)
                            </span>
                          </label>
                          <input
                            id="addressLine2"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={(event) =>
                              updateField("addressLine2", event.target.value)
                            }
                            className={inputClass}
                            placeholder="Area, landmark, floor"
                          />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label htmlFor="postcode" className="mb-2 block text-sm">
                              {fieldLabel("Postal Code")}
                            </label>
                            <input
                              id="postcode"
                              name="postcode"
                              value={formData.postcode}
                              onChange={(event) =>
                                updateField("postcode", event.target.value)
                              }
                              className={inputClass}
                              placeholder="e.g., 75500"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="city" className="mb-2 block text-sm">
                              {fieldLabel("City")}
                            </label>
                            <input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={(event) =>
                                updateField("city", event.target.value)
                              }
                              className={inputClass}
                              placeholder="e.g., Karachi"
                              required
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
                              <PackageCheck className="h-5 w-5" />
                            </div>
                            <div>
                              <h3>Order Summary</h3>
                              <p className="text-sm text-muted-foreground">
                                Physical sticker delivery
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-2 text-sm">
                            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2">
                              <span>Safe Safar QR Sticker</span>
                              <span className="text-accent">Included</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2">
                              <span>Amount</span>
                              <span>Rs. 999</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2">
                              <span>Payment Method</span>
                              <span>Cash on Delivery</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2">
                              <span>Delivery</span>
                              <span>Within 5 business days</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {errorMessage && (
                  <div
                    role="alert"
                    className="mt-5 flex items-start gap-3 rounded-2xl border border-destructive/15 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={currentStep === 0 || isSubmitting}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-3 text-sm transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  {currentStep < steps.length - 1 ? (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goNext}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-accent-foreground shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-accent-foreground shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? "Confirming..." : "Confirm Order"}
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>

                <p className="mt-5 text-center text-xs text-muted-foreground">
                  Your phone number is never printed on the QR sticker.
                </p>
              </form>

              <div className="mt-6 text-center">
                <Link href="/" className="text-sm text-primary hover:underline">
                  Back to Home
                </Link>
              </div>
            </section>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
