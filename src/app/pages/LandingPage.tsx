"use client";

import { motion } from "motion/react";
import {
  QrCode,
  UserPlus,
  Car,
  Scan,
  Ban,
  Lightbulb,
  AlertTriangle,
  Phone,
  Shield,
  PhoneOff,
  Users,
  Sparkles,
  ArrowRight,
  Droplet,
  Wrench,
  Coffee,
  Activity,
  Zap,
  MessageCircle,
  FileCheck2,
  Smartphone
} from "lucide-react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";

const storySlides = [
  {
    type: "bad-parking",
    eyebrow: "Blocked Parking",
    title: "Someone needs the owner to move the car.",
    text: "A quick scan helps the visitor reach the driver without exposing a private number.",
    image: "/images/scenarios/bad-parking.png"
  },
  {
    type: "lights-on",
    eyebrow: "Lights Left On",
    title: "Headlights are on and the owner should know.",
    text: "Safe Safar makes it simple to send a useful alert before the battery drains.",
    image: "/images/scenarios/headlights-left-on.png"
  },
  {
    type: "emergency",
    eyebrow: "Emergency Contact",
    title: "A trusted contact can be reached when it matters.",
    text: "Emergency contacts are available for urgent situations through a privacy-first flow.",
    image: "/images/scenarios/emergency-contact.png"
  },
  {
    type: "major-accident",
    eyebrow: "Major Accident",
    title: "An incident needs a fast response.",
    text: "The QR page helps the person nearby contact the vehicle owner calmly and clearly.",
    image: "/images/scenarios/minor-accident.png"
  }
] as const;

export function LandingPage() {
  const router = useRouter();
  const benefitsCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };
  const storyCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 650,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4200,
    pauseOnHover: true,
    arrows: true,
    adaptiveHeight: false,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-28 sm:px-6 md:px-12">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1642622420476-a20517d3cab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Karachi city traffic"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="text-sm text-primary">Made for Karachi</span>
            </div>

            <h1 className="mb-6 text-4xl tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
              Park smarter.<br />
              Stay reachable.<br />
              <span className="text-primary">Stay safe.</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl md:mb-12 md:text-2xl">
              Connect without exposing your number
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row md:mb-16">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/signup")}
                className="w-full px-8 py-4 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow sm:w-auto"
              >
                Join Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full px-8 py-4 bg-white/80 backdrop-blur text-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow sm:w-auto"
              >
                See How It Works
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>Smart Parking</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Community</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-6xl mb-4">How It Works</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />

          {[
            { icon: UserPlus, label: "Sign Up", desc: "Create account" },
            { icon: QrCode, label: "Get QR Sticker", desc: "Receive sticker" },
            { icon: Car, label: "Place on Car", desc: "Display on windshield" },
            { icon: Scan, label: "Scan & Connect", desc: "Instant communication" }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 border border-primary/10 relative z-10">
                  <step.icon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl mb-2">{step.label}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="px-4 py-16 sm:px-6 md:px-12 md:py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-6xl mb-4">When You Need It</h2>
          </motion.div>

          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Ban, label: "Blocked Parking" },
              { icon: Lightbulb, label: "Lights Left On" },
              { icon: AlertTriangle, label: "Major Accident" },
              { icon: Phone, label: "Emergency Contact" }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="min-h-36 bg-card rounded-3xl p-5 sm:p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition-all cursor-pointer border border-border/50"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <useCase.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm">{useCase.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parking Tag Preview */}
      <section className="overflow-hidden px-4 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative lg:min-h-[560px]"
            >
              <div className="absolute inset-x-4 top-10 h-72 -rotate-12 bg-accent/20 sm:inset-x-10 lg:h-80" />
              <div className="absolute inset-x-12 top-20 h-72 -rotate-12 bg-primary/10 sm:inset-x-24 lg:h-80" />

              <div className="relative py-6 lg:pt-20">
                <div className="hidden lg:block absolute left-4 top-0 max-w-64 text-lg leading-snug">
                  Scan using any camera phone or smart QR reader.
                </div>
                <div className="hidden lg:block absolute left-64 top-10 h-28 w-48 rounded-br-3xl border-b-4 border-r-4 border-dotted border-primary/40" />

                <div className="relative mx-auto max-w-2xl rounded-3xl border border-border/60 bg-card p-3 shadow-2xl sm:p-5">
                  <div className="grid gap-5 md:grid-cols-[1fr_260px]">
                    <div className="flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-6">
                      <div>
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                            <QrCode className="h-7 w-7 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-2xl tracking-tight sm:text-4xl">Safe Safar</p>
                            <p className="text-xs text-muted-foreground">Vehicle privacy tag</p>
                          </div>
                        </div>
                        <p className="text-2xl leading-tight sm:text-3xl md:text-4xl">
                          Scan the code to contact the vehicle owner.
                        </p>
                      </div>

                      <div className="mt-8 border-t border-dashed border-border pt-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Wrong parking, emergency contact, any issue with the vehicle.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-accent/10 p-5">
                      <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex aspect-square items-center justify-center rounded-xl border-4 border-primary/20 bg-white">
                          <QrCode className="h-28 w-28 text-foreground sm:h-36 sm:w-36" />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Scan ID</p>
                          <p className="text-sm text-accent">SS132</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-primary sm:gap-3">
                        {[Lightbulb, Ban, AlertTriangle, Phone].map((Icon, index) => (
                          <div
                            key={index}
                            className="flex h-10 items-center justify-center rounded-xl bg-white sm:h-12"
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block absolute bottom-8 left-0 h-24 w-72 rounded-bl-3xl border-b-4 border-l-4 border-dotted border-primary/40" />
                <div className="hidden lg:block absolute bottom-0 left-24 text-lg">
                  Scan and send a clear message.
                </div>
                <div className="hidden lg:block absolute right-0 top-32 h-28 w-40 rounded-tr-3xl border-r-4 border-t-4 border-dotted border-primary/40" />
                <div className="hidden lg:block absolute right-0 top-24 text-lg">
                  Safe Safar branding.
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
                Car and bike parking tag
              </p>
              <h2 className="mb-10 text-3xl sm:text-4xl md:text-6xl">
                Privacy and security at its best, Safe Safar parking tag.
              </h2>

              <div className="grid gap-8 sm:grid-cols-2">
                {[
                  {
                    icon: Shield,
                    title: "Private Contact",
                    text: "Your contact details stay hidden when someone reaches you."
                  },
                  {
                    icon: MessageCircle,
                    title: "WhatsApp Update",
                    text: "Receive updates through WhatsApp, SMS, or masked call alerts."
                  },
                  {
                    icon: FileCheck2,
                    title: "Upload Files",
                    text: "Keep vehicle documents attached and accessible with OTP."
                  },
                  {
                    icon: Smartphone,
                    title: "Emergency Call",
                    text: "Add emergency contact details for urgent parking situations."
                  }
                ].map((feature, index) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg">
                        <span className="text-accent">{index + 1}. </span>
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/signup")}
                className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-4 text-accent-foreground shadow-lg transition-shadow hover:shadow-xl"
              >
                Get Your Tag
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scenario Illustrations Slider */}
      <section className="px-4 py-16 sm:px-6 md:px-12 md:py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
          >
            <h2 className="mb-4 text-3xl md:text-6xl">Real Situations, Faster Help</h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Large visual stories that show when a Safe Safar QR code becomes useful.
            </p>
          </motion.div>

          <Slider {...storyCarouselSettings} className="scenario-slider">
            {storySlides.map((slide) => (
              <div key={slide.type} className="px-1 sm:px-3">
                <div className="grid min-h-[620px] overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl shadow-primary/5 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="flex min-h-[330px] items-center justify-center bg-secondary/40 p-3 sm:min-h-[440px] sm:p-6 lg:min-h-[620px]">
                    <img
                      src={slide.image}
                      alt={`${slide.eyebrow} illustration`}
                      className="h-full w-full rounded-3xl object-contain"
                    />
                  </div>

                  <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                    <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-accent">
                      <QrCode className="h-4 w-4" />
                      <span>{slide.eyebrow}</span>
                    </div>
                    <h3 className="mb-5 text-3xl tracking-tight sm:text-4xl lg:text-5xl">
                      {slide.title}
                    </h3>
                    <p className="mb-8 text-lg text-muted-foreground">{slide.text}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/50 bg-secondary/40 p-4">
                        <Phone className="mb-3 h-6 w-6 text-accent" />
                        <p className="text-sm text-muted-foreground">Contact owner privately</p>
                      </div>
                      <div className="rounded-2xl border border-border/50 bg-secondary/40 p-4">
                        <Shield className="mb-3 h-6 w-6 text-accent" />
                        <p className="text-sm text-muted-foreground">Number stays protected</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Smarter Karachi */}
      <section className="px-4 py-16 sm:px-6 md:px-12 md:py-24 bg-secondary/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
                Community parking network
              </p>
              <h2 className="mb-6 text-3xl sm:text-4xl md:text-6xl">A smarter Karachi</h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
                Safe Safar turns everyday parking moments into a calmer citywide habit: scan,
                notify, and help the right person take action without exposing private numbers.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: "400+", label: "Road accidents take place in Karachi daily" },
                  { value: "0", label: "Phone numbers shown publicly" },
                  { value: "24/7", label: "Vehicle help when it matters" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm"
                  >
                    <p className="mb-2 text-3xl text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-5 shadow-2xl shadow-primary/5 sm:p-8"
            >
              <div className="absolute right-8 top-8 h-24 w-24 rounded-full border border-primary/20" />
              <div className="absolute bottom-10 left-8 h-16 w-16 rounded-full bg-accent/10" />

              <div className="relative grid gap-5 sm:grid-cols-2">
                {[
                  {
                    icon: QrCode,
                    title: "Scan",
                    text: "A driver, guard, or passerby scans the Safe Safar tag."
                  },
                  {
                    icon: MessageCircle,
                    title: "Notify",
                    text: "The owner gets a clear alert for the parking issue."
                  },
                  {
                    icon: Shield,
                    title: "Protect",
                    text: "Private contact details stay hidden during the exchange."
                  },
                  {
                    icon: Users,
                    title: "Resolve",
                    text: "Small actions keep streets, homes, and workplaces moving."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className="min-h-44 rounded-2xl border border-border/50 bg-white p-6"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Karachi Needs It */}
      <section className="px-4 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
          >
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
              Why Karachi needs it
            </p>
            <h2 className="mb-5 text-3xl md:text-6xl">Safer contact when every second matters</h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Safe Safar gives people nearby a simple way to alert the right person while keeping
              private phone numbers hidden.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: AlertTriangle,
                stat: "400+",
                text: "Road accidents everyday",
                image: "/images/karachi-road-accidents.png",
                alt: "Road accident response illustration"
              },
              {
                icon: Users,
                stat: "500+",
                text: "People injured daily",
                image: "/images/karachi-people-injured.png",
                alt: "Emergency contact illustration"
              },
              {
                icon: Phone,
                stat: "5+",
                text: "Deaths daily",
                image: "/images/karachi-deaths-daily.png",
                alt: "Fatal road accident illustration"
              },
              {
                icon: Shield,
                stat: "Hidden",
                text: "Safe contact with number protected",
                image: "/images/safe-contact-number-hidden.png",
                alt: "Private vehicle contact illustration"
              }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="group overflow-hidden rounded-3xl border border-border/50 bg-card shadow-xl shadow-primary/5 transition-shadow duration-300 hover:shadow-2xl"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-white">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-lg backdrop-blur">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                </div>

                <div className="flex min-h-32 items-center gap-5 border-t border-border/50 bg-white p-5 sm:p-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-20 sm:w-20">
                    <span className="text-2xl sm:text-3xl">{item.stat}</span>
                  </div>
                  <div>
                    <p className="text-xl leading-snug text-foreground sm:text-2xl">{item.text}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {index === 3
                        ? "Safe Safar lets people reach the vehicle owner without revealing a private number."
                        : "A nearby scan can help the right person respond faster and more calmly."}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="px-4 py-16 sm:px-6 md:px-12 md:py-24 bg-secondary/50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-8 relative">
              <PhoneOff className="w-16 h-16 text-white" />
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30 animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            <h2 className="text-3xl md:text-6xl mb-6">Your Number Stays Private</h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">Contact without exposing your number</p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <Shield className="w-10 h-10 text-primary mb-4 mx-auto" />
                <p>Protected identity</p>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <PhoneOff className="w-10 h-10 text-primary mb-4 mx-auto" />
                <p>No number sharing</p>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <Zap className="w-10 h-10 text-primary mb-4 mx-auto" />
                <p>Instant connection</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cooperation / Community */}
      <section className="px-4 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-6xl mb-6">A Connected City</h2>
            <p className="mb-10 text-xl text-muted-foreground md:mb-16 md:text-2xl">Small cooperation, big impact</p>

            <div className="relative max-w-4xl mx-auto">
              <img
                src="https://images.unsplash.com/photo-1741171679170-a024eda2d44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Connected Karachi"
                className="rounded-3xl shadow-2xl w-full opacity-60"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 sm:gap-8">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-accent shadow-lg sm:h-12 sm:w-12"
                    >
                      <Users className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Slider */}
      <section id="benefits" className="px-4 py-16 sm:px-6 md:px-12 md:py-24 bg-gradient-to-br from-accent/10 to-primary/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-6xl mb-4">More Than Safety</h2>
            <p className="text-xl text-muted-foreground">Real benefits, real savings</p>
          </motion.div>

          <Slider {...benefitsCarouselSettings} className="benefits-slider">
            {[
              { icon: Droplet, label: "Car Wash", discount: "15% off" },
              { icon: Wrench, label: "Oil Change", discount: "20% off" },
              { icon: Wrench, label: "Maintenance", discount: "10% off" },
              { icon: Sparkles, label: "Detailing", discount: "15% off" },
              { icon: Coffee, label: "Restaurants", discount: "10% off" },
              { icon: Coffee, label: "Cafés", discount: "15% off" },
              { icon: Activity, label: "Padel Courts", discount: "20% off" },
              { icon: Activity, label: "Cricket Clubs", discount: "15% off" },
              { icon: Activity, label: "Football Clubs", discount: "10% off" }
            ].map((benefit, index) => (
              <div key={index} className="px-3">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-card rounded-3xl p-8 shadow-lg border border-border/50 h-64 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                    <benefit.icon className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="text-xl mb-2">{benefit.label}</h3>
                  <div className="px-4 py-2 bg-accent/10 rounded-full">
                    <p className="text-accent">{benefit.discount}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 sm:px-6 md:px-12 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-7xl mb-8">Join Safe Safar Today</h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90">Be part of the solution. Make Karachi smarter.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/signup")}
                className="w-full px-10 py-5 bg-white text-primary rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow flex items-center justify-center gap-2 sm:w-auto"
              >
                Join Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full px-10 py-5 bg-white/10 backdrop-blur text-white rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all flex items-center justify-center gap-2 sm:w-auto"
              >
                Contact Support
                <Phone className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Slider Styles */}
      <style>{`
        .scenario-slider .slick-list {
          overflow: visible;
        }
        .scenario-slider .slick-dots {
          bottom: -42px;
        }
        .scenario-slider .slick-dots li button:before {
          color: #7e7e7e;
          font-size: 10px;
        }
        .scenario-slider .slick-dots li.slick-active button:before {
          color: #22c55e;
        }
        .scenario-slider .slick-prev,
        .scenario-slider .slick-next {
          z-index: 2;
          width: 44px;
          height: 44px;
        }
        .scenario-slider .slick-prev {
          left: -18px;
        }
        .scenario-slider .slick-next {
          right: -18px;
        }
        .scenario-slider .slick-prev:before,
        .scenario-slider .slick-next:before {
          color: #22c55e;
          font-size: 34px;
          opacity: 1;
        }
        .benefits-slider .slick-dots {
          bottom: -40px;
        }
        .benefits-slider .slick-dots li button:before {
          color: #7e7e7e;
          font-size: 10px;
        }
        .benefits-slider .slick-dots li.slick-active button:before {
          color: #22c55e;
        }
        .benefits-slider .slick-prev,
        .benefits-slider .slick-next {
          z-index: 1;
        }
        .benefits-slider .slick-prev {
          left: -40px;
        }
        .benefits-slider .slick-next {
          right: -40px;
        }
        .benefits-slider .slick-prev:before,
        .benefits-slider .slick-next:before {
          color: #7e7e7e;
          font-size: 30px;
        }
        @media (max-width: 768px) {
          .scenario-slider .slick-list {
            overflow: hidden;
          }
          .scenario-slider .slick-prev,
          .scenario-slider .slick-next {
            display: none !important;
          }
          .benefits-slider .slick-prev,
          .benefits-slider .slick-next {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
