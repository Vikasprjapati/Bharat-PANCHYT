import urllib.request
import json

BASE = "http://127.0.0.1:8000/api"

def make_req(endpoint, method="GET", data=None):
    url = f"{BASE}{endpoint}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Content-Type", "application/json")
    body = json.dumps(data).encode("utf-8") if data else None
    with urllib.request.urlopen(req, data=body, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8"))

def test_full_pipeline():
    print("=" * 60)
    print("TESTING BHARAT-PANCHYT COMPLETE END-TO-END INNOVATION PIPELINE")
    print("=" * 60)

    # 1. Health
    health = make_req("/health")
    print(f"[1/9] Health Check: {health['status']} | Platform: {health['platform']} | AI Mode: {health['ai_mode']}")
    assert health["status"] == "healthy"

    # 2. Stats
    stats = make_req("/stats")
    kpis = stats["kpis"]
    print(f"[2/9] Ecosystem KPIs: {kpis['total_problems']} Problems, {kpis['validated_problems']} Validated, {kpis['research_matches']} Matches, {kpis['proposals_submitted']} Proposals, {kpis['public_outcomes']} Outcomes")
    assert kpis["total_problems"] >= 20

    # 3. Citizen Problem Submission
    new_prob_payload = {
        "title": "Severe Arsenic Contamination in Community Dugwells",
        "description": "Over 200 villagers in Sonahatu block report bitter taste and skin kerato-lesions. Two primary handpumps yield water with high suspended arsenic and turbidity.",
        "category": "Water",
        "location": "Sonahatu Block, Ranchi",
        "district": "Ranchi",
        "citizen_name": "Rameshwar Munda",
        "is_anonymous": False
    }
    prob = make_req("/problems", method="POST", data=new_prob_payload)
    prob_id = prob["id"]
    print(f"[3/9] Citizen Problem Created: {prob_id} | Status: {prob['status']} | Priority: {prob['priority']}")
    print(f"      AI Analysis Summary: {prob['ai_analysis']['summary']}")
    assert prob_id.startswith("BP-2026-")
    assert prob["status"] == "Pending Validation"

    # 4. District Validation (48h SLA)
    val_payload = {
        "problem_id": prob_id,
        "officer_name": "Shri B. K. Singh (District Planning Officer)",
        "district": "Ranchi",
        "action": "Approved",
        "notes": "Verified by block health officer. Arsenic test confirmed > 0.05 mg/L. Urgent research intervention approved."
    }
    val = make_req("/validations", method="POST", data=val_payload)
    print(f"[4/9] District Officer Validation: {val['action']} for {prob_id} (Spent {val['sla_hours_spent']}h within 48h SLA)")
    
    # Check problem status updated
    updated_prob = make_req(f"/problems/{prob_id}")
    assert updated_prob["status"] == "Validated"
    print(f"      Problem Status Updated to: {updated_prob['status']}")

    # 5. AI Research Matching & Proposal
    matches = make_req(f"/research/matches?problem_id={prob_id}")
    print(f"[5/9] AI Expertise Matches Found for {prob_id}: {len(matches)} faculty matches")
    assert len(matches) > 0
    top_match = matches[0]
    print(f"      Top Match: {top_match['researcher']['name']} ({top_match['researcher']['university']['name']}) | Score: {top_match['match_score']}%")

    prop_payload = {
        "problem_id": prob_id,
        "researcher_id": top_match["researcher_id"],
        "title": "Low-Cost Iron & Arsenic Adsorption Filter Using Activated Bauxite",
        "problem_statement": updated_prob["description"],
        "proposed_solution": "Deploy community-scale modular columns filled with modified local bauxite adsorbent providing safe water at Rs 0.04/Liter.",
        "methodology": "Phase 1: Lab column test; Phase 2: Fabrication of 2,000L/day prototype; Phase 3: Sonahatu installation.",
        "expected_outcome": "Arsenic reduced below 0.01 mg/L adhering to WHO/BIS standards, servicing 800 villagers.",
        "estimated_timeline_months": 6,
        "estimated_budget_inr": 420000,
        "required_resources": "Bauxite columns, testing spectrometer",
        "research_team": f"{top_match['researcher']['name']} (PI), 2 Scholars"
    }
    prop = make_req("/research/proposals", method="POST", data=prop_payload)
    prop_id = prop["id"]
    print(f"[6/9] Research Proposal Submitted: {prop_id} | Status: {prop['status']} | Budget: INR {prop['estimated_budget_inr']:,}")
    assert prop_id.startswith("RPR-2026-")

    # 6. Industry / CSR Funding
    partners = make_req("/funding/partners")
    partner = partners[0]
    funding_payload = {
        "proposal_id": prop_id,
        "partner_id": partner["id"],
        "funding_amount_inr": 450000,
        "funding_type": "CSR Grant",
        "csr_focus_alignment": "Schedule VII Rural Water & Sanitation",
        "why_match": f"Directly satisfies {partner['name']}'s statutory mandate for safe drinking water in Chota Nagpur villages.",
        "mentorship_offered": True,
        "milestones": "Milestone 1: Column fabrication; Milestone 2: Water testing validation."
    }
    fund = make_req("/funding/offer", method="POST", data=funding_payload)
    print(f"[7/9] CSR Funding Pledged: INR {fund['funding_amount_inr']:,} ({fund['funding_type']}) from {partner['name']}")
    assert fund["status"] == "Approved"

    # Verify project was auto-initialized
    projects = make_req("/projects")
    project = next((p for p in projects if p["proposal_id"] == prop_id), None)
    assert project is not None
    proj_id = project["id"]
    print(f"      Project Auto-Spawned in State Pipeline: {proj_id} | Status: {project['status']}")

    # 7. State Government Verification
    verif_payload = {
        "project_id": proj_id,
        "verifier_name": "State Innovation Review Council",
        "verifier_designation": "Joint Secretary, Science & Technology",
        "audit_findings": "Field water samples tested at State Public Health Laboratory. Arsenic eliminated below detectable limits (< 0.005 mg/L). Operational stability verified.",
        "is_verified": True
    }
    verif = make_req(f"/projects/{proj_id}/verify", method="POST", data=verif_payload)
    print(f"[8/9] State Government Verification: {verif['message']}")

    # 8. Publish Outcome to Public Innovation Outcome Registry
    pub_payload = {
        "title": project["title"],
        "summary_solution": "Community-scale activated bauxite adsorption columns producing 2,500 L/day of pure water.",
        "impact_metric": "850 villagers provided clean arsenic-free drinking water daily."
    }
    outcome = make_req(f"/projects/{proj_id}/publish", method="POST", data=pub_payload)
    out_id = outcome["id"]
    print(f"[9/9] Published to Public Innovation Outcome Registry: {out_id}")
    print(f"      Citizen Contributor Honored: '{outcome['citizen_contributor_name']}'")
    assert outcome["citizen_contributor_name"] == "Rameshwar Munda"
    assert outcome["is_published"] is True

    # Check Public Registry Query
    all_outcomes = make_req("/outcomes")
    found = any(o["id"] == out_id for o in all_outcomes)
    assert found is True

    # Check simulated emails
    emails = make_req("/emails")
    print(f"      Simulated Transactional Emails Generated: {len(emails)} emails in system")

    print("=" * 60)
    print("ALL 9 STAGES OF THE INNOVATION PIPELINE VERIFIED SUCCESSFULLY!")
    print("PEOPLE -> AI -> RESEARCH -> FUNDING -> IMPACT")
    print("=" * 60)

if __name__ == "__main__":
    test_full_pipeline()
