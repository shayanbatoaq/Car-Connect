"use client";

import { motion } from "motion/react";
import { ArrowRight, QrCode, Car, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    carBrand: "",
    carModel: "",
    carColor: "",
    carNumberPlate: "",
    emergencyContact1Name: "",
    emergencyContact1Phone: "",
    emergencyContact2Name: "",
    emergencyContact2Phone: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-24 sm:px-6 bg-gradient-to-br from-accent/10 to-primary/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-card rounded-3xl shadow-2xl p-6 text-center border border-border/50 sm:p-12"
        >
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-3xl mb-4">Welcome to Safe Safar!</h2>
          <p className="text-muted-foreground mb-8">
            Your account has been created. We'll send your QR sticker to your address soon.
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="w-full px-6 py-4 bg-accent text-accent-foreground rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            Back to Home
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Illustration/Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="sticky top-32">
              <h1 className="text-5xl lg:text-6xl mb-6">
                Join Safe Safar
              </h1>
              <p className="text-xl text-muted-foreground mb-12">
                Start your journey to smarter, safer parking in Karachi
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="mb-1">Get Your QR Sticker</h3>
                    <p className="text-sm text-muted-foreground">Delivered to your address</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="mb-1">Privacy Protected</h3>
                    <p className="text-sm text-muted-foreground">Your number stays hidden</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Car className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="mb-1">Stay Connected</h3>
                    <p className="text-sm text-muted-foreground">Instant notifications</p>
                  </div>
                </div>
              </div>

              {/* Decorative illustration */}
              <div className="mt-12 relative">
                <div className="w-full h-64 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                  <QrCode className="w-32 h-32 text-primary/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-card rounded-3xl shadow-2xl p-5 sm:p-8 lg:p-12 border border-border/50">
              {/* Mobile Title */}
              <div className="lg:hidden mb-8">
                <h1 className="text-3xl sm:text-4xl mb-4">Join Safe Safar</h1>
                <p className="text-muted-foreground">Fill in your details to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm mb-2">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm mb-2">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="+92 300 1234567"
                  />
                </div>

                {/* Car Details Section */}
                <div className="pt-6 border-t border-border">
                  <h3 className="mb-4 text-sm text-muted-foreground">Car Details</h3>

                  <div className="space-y-6">
                    {/* Car Brand */}
                    <div>
                      <label htmlFor="carBrand" className="block text-sm mb-2">
                        Car Brand <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="carBrand"
                        name="carBrand"
                        value={formData.carBrand}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
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

                    {/* Car Model */}
                    <div>
                      <label htmlFor="carModel" className="block text-sm mb-2">
                        Car Model <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="carModel"
                        name="carModel"
                        value={formData.carModel}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="e.g., Corolla, Civic"
                      />
                    </div>

                    {/* Car Color */}
                    <div>
                      <label htmlFor="carColor" className="block text-sm mb-2">
                        Car Color <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="carColor"
                        name="carColor"
                        value={formData.carColor}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="e.g., White, Black, Silver"
                      />
                    </div>

                    {/* Car Number Plate */}
                    <div>
                      <label htmlFor="carNumberPlate" className="block text-sm mb-2">
                        Number Plate <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="carNumberPlate"
                        name="carNumberPlate"
                        value={formData.carNumberPlate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="e.g., ABC-123"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contacts Section */}
                <div className="pt-6 border-t border-border">
                  <h3 className="mb-4 text-sm text-muted-foreground">Emergency Contacts</h3>

                  <div className="space-y-6">
                    {/* Emergency Contact 1 - Required */}
                    <div className="space-y-4 p-4 rounded-xl bg-secondary/30 border border-border/50">
                      <h4 className="text-sm">Primary Contact <span className="text-destructive">*</span></h4>

                      <div>
                        <label htmlFor="emergencyContact1Name" className="block text-sm mb-2">
                          Contact Name <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          id="emergencyContact1Name"
                          name="emergencyContact1Name"
                          value={formData.emergencyContact1Name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          placeholder="Emergency contact name"
                        />
                      </div>

                      <div>
                        <label htmlFor="emergencyContact1Phone" className="block text-sm mb-2">
                          Contact Phone <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="tel"
                          id="emergencyContact1Phone"
                          name="emergencyContact1Phone"
                          value={formData.emergencyContact1Phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                    </div>

                    {/* Emergency Contact 2 - Optional */}
                    <div className="space-y-4 p-4 rounded-xl bg-secondary/30 border border-border/50">
                      <h4 className="text-sm">Secondary Contact <span className="text-muted-foreground text-xs">(Optional)</span></h4>

                      <div>
                        <label htmlFor="emergencyContact2Name" className="block text-sm mb-2">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          id="emergencyContact2Name"
                          name="emergencyContact2Name"
                          value={formData.emergencyContact2Name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          placeholder="Emergency contact name (optional)"
                        />
                      </div>

                      <div>
                        <label htmlFor="emergencyContact2Phone" className="block text-sm mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          id="emergencyContact2Phone"
                          name="emergencyContact2Phone"
                          value={formData.emergencyContact2Phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          placeholder="+92 300 1234567 (optional)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-8 px-6 py-4 bg-accent text-accent-foreground rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                >
                  Join Safe Safar
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Privacy Note */}
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By joining, you agree to our privacy policy. Your number will never be shared.
                </p>
              </form>

              {/* Back to Home Link */}
              <div className="mt-8 text-center">
                <Link href="/" className="text-sm text-primary hover:underline">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
