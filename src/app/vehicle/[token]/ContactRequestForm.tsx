"use client";

import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

type ContactRequestFormProps = {
  vehicleId: string;
};

export function ContactRequestForm({ vehicleId }: ContactRequestFormProps) {
  const [formData, setFormData] = useState({
    requesterName: "",
    requesterPhone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage(null);

    try {
      const response = await fetch("/api/contact-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId,
          ...formData,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Could not send contact request.");
      }

      setStatus("success");
      setMessage("Your request has been sent through Safe Safar.");
      setFormData({
        requesterName: "",
        requesterPhone: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Could not send contact request."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="requesterName" className="mb-2 block text-sm">
            Your Name
          </label>
          <input
            id="requesterName"
            name="requesterName"
            value={formData.requesterName}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                requesterName: event.target.value,
              }))
            }
            className="h-12 w-full rounded-2xl border border-border bg-secondary/50 px-4 outline-none transition-colors focus:border-primary/40 focus:bg-white"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="requesterPhone" className="mb-2 block text-sm">
            Your Phone Number
          </label>
          <input
            id="requesterPhone"
            name="requesterPhone"
            type="tel"
            value={formData.requesterPhone}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                requesterPhone: event.target.value,
              }))
            }
            className="h-12 w-full rounded-2xl border border-border bg-secondary/50 px-4 outline-none transition-colors focus:border-primary/40 focus:bg-white"
            placeholder="+92 300 1234567"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              message: event.target.value,
            }))
          }
          required
          rows={4}
          className="w-full resize-none rounded-2xl border border-border bg-secondary/50 px-4 py-3 outline-none transition-colors focus:border-primary/40 focus:bg-white"
          placeholder="Tell the owner what happened or why you need to reach them."
        />
      </div>

      {message && (
        <div
          role={status === "error" ? "alert" : "status"}
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            status === "error"
              ? "border-destructive/15 bg-destructive/10 text-destructive"
              : "border-accent/20 bg-accent/10 text-accent"
          }`}
        >
          {status === "error" ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        disabled={status === "sending"}
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 text-accent-foreground shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send className="h-5 w-5" />
        <span>{status === "sending" ? "Sending..." : "Send Contact Request"}</span>
      </motion.button>
    </form>
  );
}
