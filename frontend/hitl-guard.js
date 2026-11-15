/**
 * Veritas EU AI Act Article 14(4)(b) Cognitive Dwell-Lock Widget (v2.4)
 * Zero-dependency Web Component + Attribute Decorator with Shadow DOM isolation,
 * Tab-Focus Verification, Monotonic Clock Telemetry, and Viral PLG Attribution.
 * Hosting Cost: $0.00 (Static CDN / Netlify / jsDelivr)
 */
(function (window, document) {
  "use strict";

  if (window.__VERITAS_HITL_LOADED__) return;
  window.__VERITAS_HITL_LOADED__ = true;

  const DEFAULT_DWELL_MS = 2500;
  const VERITAS_REF_URL = "https://governance.veritas-auditcomp.com/?utm_source=hitl_widget&utm_medium=plg_badge";
  const PRICING_URL = "https://governance.veritas-auditcomp.com/#pricing";

  async function sha256Hex(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return "sha256:" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function mountGuard(targetBtn) {
    if (targetBtn.dataset.veritasMounted === "true") return;
    targetBtn.dataset.veritasMounted = "true";

    const requiredDwell = Math.max(500, parseInt(targetBtn.getAttribute("data-veritas-dwell") || DEFAULT_DWELL_MS, 10));
    const taskId = targetBtn.getAttribute("data-veritas-task-id") || "TASK-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    const riskScore = parseFloat(targetBtn.getAttribute("data-veritas-risk") || "0.85");
    const licenseKey = targetBtn.getAttribute("data-veritas-key") || "";
    const isWhiteLabel = /^vts_live_[a-f0-9]{24,}$/i.test(licenseKey);

    // Create isolated Shadow DOM host right below the guarded button
    const host = document.createElement("span");
    host.style.cssText = "display:inline-flex;flex-direction:column;vertical-align:middle;margin-top:6px;max-width:100%;";
    targetBtn.insertAdjacentElement("afterend", host);
    const shadow = host.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .vts-wrap {
          display: flex; flex-direction: column; gap: 4px;
          background: #0f172a; border: 1px solid #334155; border-radius: 6px;
          padding: 6px 10px; color: #f8fafc; font-size: 11px; line-height: 1.3;
          box-shadow: 0 2px 8px rgba(0,0,0,0.22); min-width: 240px;
        }
        .vts-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .vts-status { display: flex; align-items: center; gap: 5px; font-weight: 600; color: #fbbf24; }
        .vts-status.unlocked { color: #34d399; }
        .vts-timer { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; color: #94a3b8; }
        .vts-bar-bg { width: 100%; height: 4px; background: #1e293b; border-radius: 2px; overflow: hidden; }
        .vts-bar-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #f59e0b, #10b981); transition: width 0.08s linear; }
        .vts-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 3px; border-top: 1px solid #1e293b; font-size: 10px; color: #64748b;
        }
        .vts-link { color: #38bdf8; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 3px; }
        .vts-link:hover { text-decoration: underline; color: #7dd3fc; }
        .vts-receipt { font-family: ui-monospace, monospace; font-size: 9px; color: #64748b; display: none; word-break: break-all; }
      </style>
      <div class="vts-wrap" id="vts-card">
        <div class="vts-top">
          <span class="vts-status" id="vts-status">🔒 Art. 14 Cognitive Dwell Lock</span>
          <span class="vts-timer" id="vts-timer">0.0s / ${(requiredDwell / 1000).toFixed(1)}s</span>
        </div>
        <div class="vts-bar-bg"><div class="vts-bar-fill" id="vts-bar"></div></div>
        <div class="vts-receipt" id="vts-receipt"></div>
        ${
          isWhiteLabel
            ? ""
            : `<div class="vts-footer" id="vts-badge">
                 <span>EU AI Act Art. 14(4)(b)</span>
                 <a class="vts-link" href="${VERITAS_REF_URL}" target="_blank" rel="noopener noreferrer">
                   🛡️ Protected by Veritas
                 </a>
               </div>`
        }
      </div>
    `;

    const statusEl = shadow.getElementById("vts-status");
    const timerEl = shadow.getElementById("vts-timer");
    const barEl = shadow.getElementById("vts-bar");
    const receiptEl = shadow.getElementById("vts-receipt");
    const badgeEl = shadow.getElementById("vts-badge");

    let accumulatedMs = 0;
    let lastTick = performance.now();
    let unlocked = false;

    // Hardware-lock the host button
    const originalOpacity = targetBtn.style.opacity;
    const originalCursor = targetBtn.style.cursor;
    targetBtn.disabled = true;
    targetBtn.style.opacity = "0.55";
    targetBtn.style.cursor = "not-allowed";

    // Block premature clicks or synthetic dispatch events
    targetBtn.addEventListener(
      "click",
      async function (e) {
        if (!unlocked) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        // Generate cryptographic attestation receipt on valid human approval
        const finalDwell = Math.round(accumulatedMs);
        const rawPayload = `${taskId}\vert{}${riskScore}|${finalDwell}\vert{}${new Date().toISOString()}`;
        const merkleLeaf = await sha256Hex(rawPayload);

        const detail = {
          task_id: taskId,
          oversight_mode: "HITL",
          risk_score: riskScore,
          operator_dwell_ms: finalDwell,
          curr_merkle_hash: merkleLeaf,
          attested_at: new Date().toISOString()
        };

        receiptEl.style.display = "block";
        receiptEl.textContent = `Attested: ${merkleLeaf.substring(0, 32)}... (${finalDwell}ms)`;
        targetBtn.setAttribute("data-veritas-attestation", JSON.stringify(detail));
        targetBtn.dispatchEvent(new CustomEvent("veritas:attested", { bubbles: true, detail }));
      },
      true
    );

    function tick(now) {
      if (unlocked) return;
      const delta = now - lastTick;
      lastTick = now;

      // Verify badge wasn't hidden via CSS tampering on free tier
      let badgeIntact = true;
      if (!isWhiteLabel && badgeEl) {
        const hostStyle = window.getComputedStyle(host);
        if (hostStyle.display === "none" || hostStyle.visibility === "hidden" || parseFloat(hostStyle.opacity) < 0.2) {
          badgeIntact = false;
        }
      }

      // Only accumulate dwell time when browser tab is active and badge is intact
      if (document.visibilityState === "visible" && document.hasFocus() && badgeIntact) {
        accumulatedMs = Math.min(requiredDwell, accumulatedMs + delta);
      } else if (!badgeIntact) {
        statusEl.textContent = "⚠️ Attribution Required (Free Tier)";
      } else {
        statusEl.textContent = "⏸️ Paused (Focus Window to Review)";
      }

      const pct = Math.min(100, (accumulatedMs / requiredDwell) * 100);
      barEl.style.width = pct + "%";
      timerEl.textContent = `${(accumulatedMs / 1000).toFixed(1)}s / ${(requiredDwell / 1000).toFixed(1)}s`;

      if (accumulatedMs >= requiredDwell) {
        unlocked = true;
        targetBtn.disabled = false;
        targetBtn.style.opacity = originalOpacity || "1";
        targetBtn.style.cursor = originalCursor || "pointer";
        statusEl.textContent = "✅ Art. 14 Human Review Verified";
        statusEl.classList.add("unlocked");
      } else {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame((now) => {
      lastTick = now;
      requestAnimationFrame(tick);
    });
  }

  function scanDOM() {
    document.querySelectorAll("[data-veritas-guard]").forEach(mountGuard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scanDOM);
  } else {
    scanDOM();
  }

  // Automatically guard dynamically rendered React / Vue / Next.js buttons
  const observer = new MutationObserver(scanDOM);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.VeritasGuard = { mount: mountGuard, scan: scanDOM, pricingUrl: PRICING_URL };
})(window, document);
