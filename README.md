# Veritas EU AI Act Article 14 Scanner (`veritas-article14-scanner`)

Zero-dependency Python CLI and CI/CD state auditor for **EU AI Act Article 14 (Human Oversight)**, **GDPR Article 25 (Zero-PII SHA-256 Masking)**, and **NIST AI RMF (AI 600-1)** cryptographic state attestation in LangGraph and autonomous agent pipelines.

[![Live Tri-Modal Sandbox](https://img.shields.io/badge/Live_Demo-Tri--Modal_HITL_Workbench-10b981?style=for-the-badge)](https://governance.veritas-auditcomp.com)
[![Live Merkle Sidecar API](https://img.shields.io/badge/OpenAPI_Spec-VPC_Merkle_Sidecar-3b82f6?style=for-the-badge)](https://api.veritas-auditcomp.com/docs)

---

## Why Standard Agent Logs Fail EU AI Act Audits

Under **EU AI Act Article 14(4)(b)**, high-risk AI systems must prevent *"automation bias"* (human operators rubber-stamping AI decisions in `<500ms` without cognitive review). Standard observability logs fail statutory audits in three places:
1. **Rubber-Stamp Approvals:** Operator UI buttons lack a hardware-enforced cognitive dwell lock (`>= 2,500ms`).
2. **PII Leakage in Telemetry:** Raw customer emails or national IDs are written into trace logs instead of salted `sha256:` digests.
3. **Mutable SQL/JSON Logs:** Standard audit tables allow retroactive `UPDATE`/`DELETE` statements without cryptographic hash-chaining.

---

## Quick Start (Zero Dependencies)

Run the built-in diagnostic against sample agent traces or pass your own JSON state log file:

```bash
git clone [https://github.com/Jayvion-Strata/veritas-article14-scanner.git](https://github.com/Jayvion-Strata/veritas-article14-scanner.git)
cd veritas-article14-scanner
python3 article14_scanner.py
```

To audit your own exported LangGraph / agent trace file:
```bash
python3 article14_scanner.py path/to/agent_traces.json
```

### Example Terminal Output
```text
============================================================================
 VERITAS EU AI ACT ARTICLE 14 & ZERO-PII STATE AUDITOR (v2.4 Open-Core)
============================================================================
 [FAIL] [TXN-AML-9041] GDPR ART.25 VIOLATION: 'subject_hash' exposes raw PII ('john.doe@enterpris...').
 [FAIL] [TXN-AML-9041] EU AI ACT ART.14(4)(b) VIOLATION: Dwell 420ms < 2500ms lock.
 [FAIL] [TXN-AML-9041] NIST AI 600-1 VIOLATION: Missing immutable 'curr_merkle_hash' attestation.
----------------------------------------------------------------------------
 TRACES AUDITED: 2 | STATUTORY VIOLATIONS DETECTED: 3

 [!] PRODUCTION REMEDIATION & DROP-IN INFRASTRUCTURE:
  1. Live 2,500ms Hardware Dwell-Lock UI Sandbox:
     -> [https://governance.veritas-auditcomp.com](https://governance.veritas-auditcomp.com)
  2. Live VPC Merkle Sidecar OpenAPI Spec:
     -> [https://api.veritas-auditcomp.com/docs](https://api.veritas-auditcomp.com/docs)
  3. Download Full Production Kit (HTML5 UI + LangGraph + VPC Sidecar):
     -> [https://governance.veritas-auditcomp.com/#pricing](https://governance.veritas-auditcomp.com/#pricing)
============================================================================
```

---

## Drop-In Production Remediation

This CLI scanner is the open-core diagnostic linter for the **Veritas Agentic Governance & Zero-PII Telemetry Kit (v2.4)**:

* **Interactive Tri-Modal HITL Workbench (Live Sandbox):** [https://governance.veritas-auditcomp.com](https://governance.veritas-auditcomp.com)
* **VPC Merkle Sidecar Swagger Specification:** [https://api.veritas-auditcomp.com/docs](https://api.veritas-auditcomp.com/docs)
* **Full Self-Serve Production Codebase (HTML5 Dwell-Lock UI + LangGraph Orchestrator + FastAPI/PostgreSQL Immutability Sidecar):** [Download via Veritas Licensing](https://governance.veritas-auditcomp.com/#pricing)


---

## Automate PR Compliance Audits (GitHub Actions Marketplace)

Add **Veritas EU AI Act Article 14 Auditor** to your repository's `.github/workflows/eu-ai-act-audit.yml` to automatically audit agent state logs and post a sticky compliance attestation table on every Pull Request:

```yaml
name: EU AI Act Article 14 Compliance Gate

on:
  pull_request:
    branches: [ main, master ]

permissions:
  contents: read
  pull-requests: write

jobs:
  article14-hitl-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Run Veritas EU AI Act Article 14 & Zero-PII Auditor
        uses: Jayvion-Strata/veritas-article14-scanner@v1
        with:
          trace-file: "agent_traces.json"
          fail-on-violation: "true"
          post-pr-comment: "true"
```
---

## Drop-In Frontend Widget (`hitl-guard.js`)

Enforce **EU AI Act Article 14(4)(b)** hardware cognitive dwell locks (`>=2,500ms`) on any HTML, React, or Vue approval button with 1 line of code. Automatically pauses if the operator switches tabs and dispatches a `veritas:attested` SHA-256 cryptographic receipt upon human approval.

```html
<!-- 1. Load the Zero-Dependency Veritas Guard Script -->
<script src="[https://governance.veritas-auditcomp.com/hitl-guard.js](https://governance.veritas-auditcomp.com/hitl-guard.js)" defer></script>

<!-- 2. Add data-veritas-guard to any High-Risk AI Approval Button -->
<button
  id="approve-loan-btn"
  data-veritas-guard
  data-veritas-dwell="2500"
  data-veritas-task-id="TXN-AML-9041"
  data-veritas-risk="0.92">
  Approve High-Risk Wire Transfer
</button>

<script>
  // Optional: Listen for the cryptographic attestation payload on click
  document.getElementById("approve-loan-btn").addEventListener("veritas:attested", (e) => {
    console.log("EU AI Act Article 14 Receipt:", e.detail);
    // e.detail -> { task_id, operator_dwell_ms: 2512, curr_merkle_hash: "sha256:...", attested_at: "..." }
  });
</script>
```
> **Note:** The free community widget includes a `"Protected by Veritas"` verification link inside an isolated Shadow DOM. To unlock white-label mode (`data-veritas-key="vts_live_..."`) and automated PostgreSQL Merkle Sidecar ingestion, [upgrade to a Veritas Commercial License](https://governance.veritas-auditcomp.com/#pricing).
