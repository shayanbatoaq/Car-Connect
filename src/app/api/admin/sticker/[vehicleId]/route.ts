import QRCode from "qrcode";
import {
  getSiteUrl,
  getSupabaseAdmin,
  isAdminRequestAuthorized,
  jsonError,
} from "../../../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ vehicleId: string }>;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(request: Request, { params }: RouteContext) {
  // TODO: Replace this MVP password check with real admin authentication.
  try {
    if (!isAdminRequestAuthorized(request)) {
      return Response.json({ error: "Invalid admin password." }, { status: 401 });
    }

    const { vehicleId } = await params;
    const supabase = getSupabaseAdmin();
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id, qr_token, number_plate")
      .eq("id", vehicleId)
      .maybeSingle();

    if (vehicleError) {
      throw vehicleError;
    }

    if (!vehicle) {
      return Response.json({ error: "Vehicle not found." }, { status: 404 });
    }

    const qrUrl = `${getSiteUrl()}/vehicle/${encodeURIComponent(vehicle.qr_token)}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 320,
    });

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Safe Safar Sticker</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f5f5f5;
        color: #171717;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .sheet {
        width: min(92vw, 420px);
        border: 1px solid #d4d4d4;
        border-radius: 24px;
        background: white;
        padding: 28px;
        text-align: center;
        box-shadow: 0 24px 80px rgba(23, 23, 23, 0.12);
      }
      .brand {
        margin: 0 0 8px;
        font-size: 36px;
        line-height: 1;
        letter-spacing: 0;
      }
      .subtitle {
        margin: 0 0 24px;
        color: #525252;
        font-size: 16px;
      }
      .qr {
        width: 100%;
        max-width: 320px;
        border: 10px solid #f5f5f5;
        border-radius: 20px;
      }
      .plate {
        margin: 18px auto 0;
        width: fit-content;
        border-radius: 999px;
        background: #dcfce7;
        color: #166534;
        padding: 8px 14px;
        font-weight: 700;
      }
      .print {
        margin-top: 24px;
        border: 0;
        border-radius: 14px;
        background: #22c55e;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 12px 18px;
      }
      @media print {
        body { background: white; }
        .sheet { box-shadow: none; border-color: #111; }
        .print { display: none; }
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <h1 class="brand">Safe Safar</h1>
      <p class="subtitle">Scan to contact owner</p>
      <img class="qr" src="${qrCodeDataUrl}" alt="Safe Safar QR code" />
      <p class="plate">${escapeHtml(vehicle.number_plate)}</p>
      <button class="print" type="button" onclick="window.print()">Print Sticker</button>
    </main>
  </body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
