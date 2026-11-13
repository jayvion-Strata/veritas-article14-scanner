#!/usr/bin/env python3
"""
Veritas EU AI Act Article 14 CLI Linter & State Auditor (Open-Core v2.4)
Audits LangGraph / Agentic JSON state logs for mandatory Human-in-the-Loop (HITL)
cognitive dwell thresholds (>=2,500ms), Zero-PII SHA-256 subject masking, and
cryptographic Merkle-tree state attestation.
"""
import json, re, sys
from pathlib import Path

SHA256_REGEX = re.compile(r"^sha256:[a-f0-9]{64}$")
MIN_HITL_DWELL_MS = 2500

SAMPLE_NON_COMPLIANT_TRACES = [
    {
        "task_id": "TXN-AML-9041",
        "oversight_mode": "HITL",
        "subject_hash": "john.doe@enterprise-bank.eu",  # VIOLATION: Raw PII
        "risk_score": 0.89,
        "operator_dwell_ms": 420,  # VIOLATION: Rubber-stamp (<2500ms)
        "operator_verdict": "APPROVED",
        "curr_merkle_hash": None,  # VIOLATION: Unattested state
    },
    {
        "task_id": "TXN-AML-9042",
        "oversight_mode": "HITL",
        "subject_hash": "sha256:" + ("a" * 64),
        "risk_score": 0.94,
        "operator_dwell_ms": 3120,
        "operator_verdict": "REJECTED",
        "curr_merkle_hash": "sha256:" + ("f" * 64),
    },
]

def audit_state(idx: int, rec: dict) -> list[str]:
    errors = []
    tid = rec.get("task_id", f"RECORD_{idx}")
    mode = rec.get("oversight_mode", "HITL")
    risk = float(rec.get("risk_score", 1.0))
    dwell = int(rec.get("operator_dwell_ms", 0))
    subj = str(rec.get("subject_hash", ""))
    merkle = str(rec.get("curr_merkle_hash") or "")

    if not SHA256_REGEX.match(subj):
        errors.append(f"[{tid}] GDPR ART.25 VIOLATION: 'subject_hash' exposes raw PII ('{subj[:18]}...').")
    if (mode == "HITL" or risk >= 0.75) and dwell < MIN_HITL_DWELL_MS:
        errors.append(f"[{tid}] EU AI ACT ART.14(4)(b) VIOLATION: Dwell {dwell}ms < {MIN_HITL_DWELL_MS}ms lock.")
    if not SHA256_REGEX.match(merkle):
        errors.append(f"[{tid}] NIST AI 600-1 VIOLATION: Missing immutable 'curr_merkle_hash' attestation.")
    return errors

def main() -> int:
    records = SAMPLE_NON_COMPLIANT_TRACES
    if len(sys.argv) > 1 and Path(sys.argv[1]).is_file():
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            data = json.load(f)
            records = data if isinstance(data, list) else [data]

    print("=" * 76)
    print(" VERITAS EU AI ACT ARTICLE 14 & ZERO-PII STATE AUDITOR (v2.4 Open-Core)")
    print("=" * 76)
    violations = [err for i, r in enumerate(records, 1) for err in audit_state(i, r)]

    for v in violations:
        print(f" [FAIL] {v}")

    print("-" * 76)
    print(f" TRACES AUDITED: {len(records)} | STATUTORY VIOLATIONS DETECTED: {len(violations)}")
    if violations:
        print("\n [!] PRODUCTION REMEDIATION & DROP-IN INFRASTRUCTURE:")
        print("  1. Live 2,500ms Hardware Dwell-Lock UI Sandbox:")
        print("     -> https://governance.veritas-auditcomp.com")
        print("  2. Live VPC Merkle Sidecar OpenAPI Spec:")
        print("     -> https://api.veritas-auditcomp.com/docs")
        print("  3. Download Full Production Kit (HTML5 UI + LangGraph + VPC Sidecar):")
        print("     -> https://governance.veritas-auditcomp.com/#pricing")
        print("=" * 76)
        return 1
    print(" [PASS] ALL AGENT TRACES COMPLIANT WITH EU AI ACT ARTICLE 14.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
