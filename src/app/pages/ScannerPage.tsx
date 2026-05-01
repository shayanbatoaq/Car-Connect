"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Car,
  RefreshCw,
  ScanLine,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

type ScannerState = "idle" | "requesting" | "scanning" | "success" | "error";
type CameraDevice = { id: string; label: string };
type Html5QrcodeModule = typeof import("html5-qrcode");
type Html5QrcodeInstance = InstanceType<Html5QrcodeModule["Html5Qrcode"]>;
type PlateSearchResult = {
  token: string;
  carBrand: string;
  carModel: string;
  carColor: string;
  numberPlate: string;
};

const scannerMessages: Record<Exclude<ScannerState, "idle">, string> = {
  requesting: "Camera permission required",
  scanning: "Scanning...",
  success: "QR detected. Redirecting...",
  error: "Invalid Safe Safar QR",
};

function getErrorText(error: unknown) {
  if (error instanceof Error) {
    return `${error.name} ${error.message}`;
  }

  return String(error);
}

function getCameraErrorMessage(error: unknown) {
  const text = getErrorText(error).toLowerCase();

  if (
    text.includes("permission") ||
    text.includes("notallowed") ||
    text.includes("denied")
  ) {
    return "Camera permission required";
  }

  if (
    text.includes("notfound") ||
    text.includes("not found") ||
    text.includes("no camera") ||
    text.includes("overconstrained")
  ) {
    return "No camera found";
  }

  return "Scanner failed to start";
}

function pickRearCamera(cameras: CameraDevice[]) {
  const rearCamera = cameras.find((camera) =>
    /back|rear|environment|world/i.test(camera.label)
  );

  return rearCamera?.id ?? cameras[cameras.length - 1]?.id ?? cameras[0]?.id;
}

function cleanToken(candidate: unknown) {
  if (typeof candidate !== "string") {
    return null;
  }

  const token = candidate.trim();
  return /^[A-Za-z0-9][A-Za-z0-9_-]{2,79}$/.test(token) ? token : null;
}

function extractToken(value: string) {
  try {
    const parsed = JSON.parse(value) as {
      token?: unknown;
      vehicleToken?: unknown;
      vehicle?: unknown;
      id?: unknown;
    };
    const jsonToken =
      cleanToken(parsed.token) ??
      cleanToken(parsed.vehicleToken) ??
      cleanToken(parsed.vehicle) ??
      cleanToken(parsed.id);

    if (jsonToken) {
      return jsonToken;
    }
  } catch {
    // QR payloads are commonly plain strings, so non-JSON is expected.
  }

  try {
    const params = new URLSearchParams(value.startsWith("?") ? value : `?${value}`);
    const paramToken =
      cleanToken(params.get("token")) ??
      cleanToken(params.get("vehicleToken")) ??
      cleanToken(params.get("vehicle")) ??
      cleanToken(params.get("id"));

    if (paramToken) {
      return paramToken;
    }
  } catch {
    // Ignore malformed query-like strings and try pattern matching.
  }

  const labelledToken = value.match(
    /(?:token|vehicleToken|vehicle|id)\s*[:=]\s*([A-Za-z0-9_-]{3,80})/i
  );

  return cleanToken(labelledToken?.[1]) ?? cleanToken(value);
}

function routeFromWebsiteUrl(url: URL) {
  const vehicleMatch = url.pathname.match(/^\/vehicle\/([^/?#]+)\/?$/);
  const token = cleanToken(vehicleMatch?.[1] ? decodeURIComponent(vehicleMatch[1]) : null);

  if (token) {
    return `/vehicle/${encodeURIComponent(token)}`;
  }

  return url.host === window.location.host
    ? `${url.pathname}${url.search}${url.hash}`
    : null;
}

function resolveScannedDestination(rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    return null;
  }

  const embeddedUrl = value.match(/https?:\/\/[^\s]+/i)?.[0];

  if (embeddedUrl) {
    try {
      const url = new URL(embeddedUrl);
      return routeFromWebsiteUrl(url);
    } catch {
      return null;
    }
  }

  if (value.startsWith("/")) {
    try {
      const url = new URL(value, window.location.origin);
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return null;
    }
  }

  const token = extractToken(value);
  return token ? `/vehicle/${encodeURIComponent(token)}` : null;
}

export function ScannerPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(126,126,126,0.12),_transparent_34rem),linear-gradient(180deg,_#fafafa_0%,_#f5f5f5_100%)] px-4 pb-32 pt-28 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/85 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back home</span>
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm text-primary">
            <ScanLine className="h-4 w-4" />
            <span>Scan Vehicle</span>
          </div>
          <h1 className="mb-3 text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Scan QR to Contact Owner
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Point your camera at the vehicle sticker or search by number plate.
          </p>
        </motion.header>

        <div className="space-y-5">
          <QRScannerCard />
          <PlateSearchCard />
          <PrivacyNoteCard />
        </div>
      </div>
    </main>
  );
}

function QRScannerCard() {
  const router = useRouter();
  const reactId = useId();
  const scannerRef = useRef<Html5QrcodeInstance | null>(null);
  const isScanningRef = useRef(false);
  const isStartingRef = useRef(false);
  const detectedRef = useRef(false);
  const redirectTimerRef = useRef<number | null>(null);
  const [status, setStatus] = useState<ScannerState>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  const readerId = useMemo(
    () => `safe-safar-qr-reader-${reactId.replace(/[^A-Za-z0-9_-]/g, "")}`,
    [reactId]
  );
  const isCameraActive =
    status === "requesting" || status === "scanning" || status === "success";
  const canSwitchCamera = cameras.length > 1 && status === "scanning";
  const scannerBadge = status === "scanning" ? "Live scan" : "Ready";

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    isStartingRef.current = false;

    if (!scanner) {
      isScanningRef.current = false;
      return;
    }

    try {
      if (isScanningRef.current || scanner.isScanning) {
        await scanner.stop();
      }
    } catch (error) {
      console.warn("Safe Safar scanner stop failed", error);
    }

    try {
      scanner.clear();
    } catch (error) {
      console.warn("Safe Safar scanner clear failed", error);
    }

    scannerRef.current = null;
    isScanningRef.current = false;
  }, []);

  const stopCamera = useCallback(async () => {
    detectedRef.current = false;
    if (redirectTimerRef.current) {
      window.clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }

    await stopScanner();
    setStatus("idle");
    setStatusMessage(null);
  }, [stopScanner]);

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      if (detectedRef.current) {
        return;
      }

      detectedRef.current = true;
      console.log("Safe Safar QR scanned:", decodedText);

      const destination = resolveScannedDestination(decodedText);

      if (!destination) {
        setStatus("error");
        setStatusMessage("Invalid Safe Safar QR");
        await stopScanner();
        return;
      }

      setStatus("success");
      setStatusMessage(scannerMessages.success);
      await stopScanner();

      redirectTimerRef.current = window.setTimeout(() => {
        router.push(destination);
      }, 450);
    },
    [router, stopScanner]
  );

  const startCamera = useCallback(
    async (cameraIdOverride?: string) => {
      if (status === "requesting" || isStartingRef.current) {
        return;
      }

      isStartingRef.current = true;
      detectedRef.current = false;
      setStatus("requesting");
      setStatusMessage(scannerMessages.requesting);

      try {
        await stopScanner();

        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
          "html5-qrcode"
        );
        const availableCameras = await Html5Qrcode.getCameras();

        if (!availableCameras.length) {
          throw new Error("No camera found");
        }

        setCameras(availableCameras);

        const preferredCameraId =
          cameraIdOverride ??
          (selectedCameraId &&
          availableCameras.some((camera) => camera.id === selectedCameraId)
            ? selectedCameraId
            : pickRearCamera(availableCameras));

        setSelectedCameraId(preferredCameraId);

        const scanner = new Html5Qrcode(readerId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });

        scannerRef.current = scanner;

        await scanner.start(
          preferredCameraId,
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const size = Math.floor(
                Math.min(viewfinderWidth, viewfinderHeight) * 0.72
              );

              return { width: size, height: size };
            },
            aspectRatio: 4 / 3,
            disableFlip: false,
          },
          (decodedText) => {
            void handleScanSuccess(decodedText);
          },
          () => undefined
        );

        isScanningRef.current = true;
        isStartingRef.current = false;
        setStatus("scanning");
        setStatusMessage(scannerMessages.scanning);
      } catch (error) {
        isStartingRef.current = false;
        await stopScanner();
        setStatus("error");
        setStatusMessage(getCameraErrorMessage(error));
      }
    },
    [handleScanSuccess, readerId, selectedCameraId, status, stopScanner]
  );

  const switchCamera = useCallback(async () => {
    if (!canSwitchCamera) {
      return;
    }

    const currentIndex = cameras.findIndex(
      (camera) => camera.id === selectedCameraId
    );
    const nextCamera = cameras[(currentIndex + 1 + cameras.length) % cameras.length];

    if (!nextCamera) {
      return;
    }

    setSelectedCameraId(nextCamera.id);
    await stopScanner();
    void startCamera(nextCamera.id);
  }, [cameras, canSwitchCamera, selectedCameraId, startCamera, stopScanner]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }

      void stopScanner();
    };
  }, [stopScanner]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="rounded-3xl border border-border/60 bg-card p-4 shadow-[0_20px_70px_rgba(126,126,126,0.14)] sm:p-5 md:p-6"
      aria-label="QR scanner"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl">Vehicle QR Scanner</h2>
            <p className="text-sm text-muted-foreground">
              Align QR inside the frame
            </p>
          </div>
        </div>
        <div className="hidden rounded-full bg-accent/10 px-3 py-1.5 text-sm text-accent sm:inline-flex">
          {scannerBadge}
        </div>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-border/70 bg-neutral-950 shadow-inner sm:aspect-[4/3]">
        <div
          id={readerId}
          className={`absolute inset-0 h-full w-full overflow-hidden rounded-[1.75rem] transition-opacity duration-300 ${
            isCameraActive ? "opacity-100" : "opacity-0"
          }`}
        />

        <ScannerOverlay active={isCameraActive} status={status} />

        <AnimatePresence>
          {!isCameraActive && (
            <motion.div
              key="camera-placeholder"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-neutral-950 via-neutral-900 to-primary/70 px-6 text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur">
                <Camera className="h-9 w-9" />
              </div>
              <div>
                <p className="text-lg text-white">Camera is off</p>
                <p className="mt-1 max-w-xs text-sm text-white/65">
                  Start camera access when you are ready to scan.
                </p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => void startCamera()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm text-foreground shadow-lg transition-shadow hover:shadow-xl"
              >
                <Camera className="h-4 w-4" />
                <span>Start Camera</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScannerStatusMessage status={status} message={statusMessage} />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {(status === "requesting" || status === "scanning") && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => void stopCamera()}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-3 text-sm text-foreground shadow-sm transition-shadow hover:shadow-md"
          >
            <Camera className="h-4 w-4" />
            <span>Stop Camera</span>
          </motion.button>
        )}

        {canSwitchCamera && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => void switchCamera()}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-5 py-3 text-sm text-primary transition-colors hover:bg-primary/15"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Switch Camera</span>
          </motion.button>
        )}

        <Link
          href="/"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm text-primary-foreground shadow-lg shadow-primary/20 transition-shadow hover:shadow-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <style>{`
        #${readerId},
        #${readerId} video {
          width: 100% !important;
          height: 100% !important;
        }

        #${readerId} video {
          object-fit: cover !important;
          border-radius: 1.75rem;
        }

        #${readerId} canvas {
          display: none !important;
        }

        @keyframes safe-safar-scan {
          0%, 100% {
            transform: translateY(12%);
            opacity: 0.25;
          }

          50% {
            transform: translateY(86%);
            opacity: 1;
          }
        }
      `}</style>
    </motion.section>
  );
}

function ScannerOverlay({
  active,
  status,
}: {
  active: boolean;
  status: ScannerState;
}) {
  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 bg-black/15">
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative aspect-square w-[74%] max-w-72 rounded-[1.65rem] border border-white/35 bg-white/5 shadow-[0_0_0_999px_rgba(0,0,0,0.18)] backdrop-blur-[1px]">
          <span className="absolute left-0 top-0 h-11 w-11 rounded-tl-[1.65rem] border-l-4 border-t-4 border-white" />
          <span className="absolute right-0 top-0 h-11 w-11 rounded-tr-[1.65rem] border-r-4 border-t-4 border-white" />
          <span className="absolute bottom-0 left-0 h-11 w-11 rounded-bl-[1.65rem] border-b-4 border-l-4 border-white" />
          <span className="absolute bottom-0 right-0 h-11 w-11 rounded-br-[1.65rem] border-b-4 border-r-4 border-white" />

          {status === "scanning" && (
            <span className="absolute left-[10%] right-[10%] top-0 h-0.5 rounded-full bg-accent shadow-[0_0_22px_rgba(34,197,94,0.95)] [animation:safe-safar-scan_2.2s_ease-in-out_infinite]" />
          )}
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-6 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-sm text-white shadow-lg backdrop-blur">
          <ScanLine className="h-4 w-4" />
          <span>Align QR inside the frame</span>
        </div>
      </div>
    </div>
  );
}

function ScannerStatusMessage({
  status,
  message,
}: {
  status: ScannerState;
  message: string | null;
}) {
  const statusConfig = useMemo(() => {
    if (status === "idle") {
      return null;
    }

    const isError = status === "error";
    const isSuccess = status === "success";

    return {
      icon: isError ? AlertTriangle : isSuccess ? ShieldCheck : ScanLine,
      text: message ?? scannerMessages[status],
      className: isError
        ? "border-destructive/15 bg-destructive/10 text-destructive"
        : isSuccess
          ? "border-accent/20 bg-accent/10 text-accent"
          : "border-primary/15 bg-primary/10 text-primary",
    };
  }, [message, status]);

  return (
    <AnimatePresence mode="wait">
      {statusConfig && (
        <motion.div
          key={`${status}-${statusConfig.text}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className={`mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${statusConfig.className}`}
          role={status === "error" ? "alert" : "status"}
        >
          <statusConfig.icon className="h-5 w-5 shrink-0" />
          <span>{statusConfig.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PlateSearchCard() {
  const router = useRouter();
  const [plate, setPlate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [matches, setMatches] = useState<PlateSearchResult[]>([]);

  const normalizedPlate = plate.trim();

  const handlePlateChange = (value: string) => {
    const nextValue = value.toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9-]/g, "");
    setPlate(nextValue);
    setMatches([]);

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMatches([]);

    if (!normalizedPlate) {
      setError("Please enter a number plate");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/vehicle/search?plate=${encodeURIComponent(normalizedPlate)}`
      );
      const result = await response.json().catch(() => ({}));

      if (response.status === 404) {
        setError("No active Safe Safar vehicle found for this number plate.");
        return;
      }

      if (!response.ok) {
        throw new Error(result.error ?? "Search failed. Please try again.");
      }

      const results = Array.isArray(result.results)
        ? (result.results as PlateSearchResult[])
        : [];

      if (result.token || results.length === 1) {
        router.push(`/vehicle/${encodeURIComponent(result.token ?? results[0].token)}`);
        return;
      }

      setMatches(results);
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Search failed. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.14 }}
      className="rounded-3xl border border-border/60 bg-card p-4 shadow-xl shadow-primary/5 sm:p-5 md:p-6"
      aria-labelledby="plate-search-heading"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Car className="h-6 w-6" />
        </div>
        <div>
          <h2 id="plate-search-heading" className="text-xl sm:text-2xl">
            Search by Number Plate
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Can't scan the sticker? Enter the vehicle number plate.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
          value={plate}
          onChange={(event) => handlePlateChange(event.target.value)}
          aria-label="Number plate"
          placeholder="ABC-123"
            autoCapitalize="characters"
            inputMode="text"
            className="h-14 w-full rounded-2xl border border-border bg-secondary/50 pl-12 pr-4 text-lg tracking-wide text-foreground shadow-inner outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:bg-white"
            aria-invalid={Boolean(error)}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              key="plate-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 rounded-2xl border border-destructive/15 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSearching}
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 text-accent-foreground shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Search className="h-5 w-5" />
          <span>{isSearching ? "Searching..." : "Find Vehicle"}</span>
        </motion.button>
      </form>

      {matches.length > 1 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Multiple active vehicles found. Select the matching vehicle.
          </p>
          {matches.map((match) => (
            <button
              key={match.token}
              type="button"
              onClick={() => router.push(`/vehicle/${encodeURIComponent(match.token)}`)}
              className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border/70 bg-secondary/40 p-4 text-left transition-colors hover:bg-secondary"
            >
              <div className="min-w-0">
                <p className="truncate text-base">
                  {match.carColor} {match.carBrand} {match.carModel}
                </p>
                <p className="text-sm text-muted-foreground">{match.numberPlate}</p>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-primary" />
            </button>
          ))}
        </div>
      )}
    </motion.section>
  );
}

function PrivacyNoteCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="rounded-3xl border border-accent/15 bg-accent/10 p-4 text-sm text-foreground shadow-sm sm:p-5"
      aria-label="Privacy note"
    >
      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <p className="leading-relaxed text-muted-foreground">
          <span className="text-foreground">Phone numbers stay protected.</span>{" "}
          This page only helps connect you to the vehicle owner through Safe Safar.
        </p>
      </div>
    </motion.section>
  );
}
