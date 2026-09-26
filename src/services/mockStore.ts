import {
  Problem,
  Researcher,
  University,
  ExpertiseMatch,
  ResearchProposal,
  FundingPartner,
  FundingInterest,
  Project,
  PublicOutcome,
  NotificationItem,
  SimulatedEmail,
  EcosystemStats
} from '../types';
import { classifyProblemSemantics } from './clientAiService';

const STORAGE_KEY = 'BHARAT_PANCHYT_DATASTORE_V2';

// Initial Seed Data to ensure Vercel / any other PC has full data out of the box!
const SEED_UNIVERSITIES: University[] = [
  { id: 1, name: "Birla Institute of Technology (BIT) Mesra", state: "Jharkhand", district: "Ranchi", aishe_code: "U-0245", nirf_rank: 53, specialization: "Engineering, Hydrology & Remote Sensing" },
  { id: 2, name: "National Institute of Technology (NIT) Jamshedpur", state: "Jharkhand", district: "East Singhbhum", aishe_code: "U-0247", nirf_rank: 86, specialization: "Materials, Water Tech & Smart Manufacturing" },
  { id: 3, name: "Indian Institute of Technology (ISM) Dhanbad", state: "Jharkhand", district: "Dhanbad", aishe_code: "U-0246", nirf_rank: 14, specialization: "Earth Sciences, Mining & Environmental Eng" },
  { id: 4, name: "Birsa Agricultural University (BAU)", state: "Jharkhand", district: "Ranchi", aishe_code: "U-0248", nirf_rank: 41, specialization: "Agronomy, Soil Sciences & Forestry" },
  { id: 5, name: "All India Institute of Medical Sciences (AIIMS) Deoghar", state: "Jharkhand", district: "Deoghar", aishe_code: "U-0982", nirf_rank: 35, specialization: "Community Medicine & Rural Health Diagnostics" },
  { id: 6, name: "Central University of Jharkhand (CUJ)", state: "Jharkhand", district: "Ranchi", aishe_code: "U-0250", nirf_rank: 105, specialization: "Energy Engineering & Environmental Science" },
  { id: 7, name: "Ranchi University", state: "Jharkhand", district: "Ranchi", aishe_code: "U-0249", nirf_rank: 120, specialization: "Applied Sciences & Tribal Livelihoods" },
  { id: 8, name: "Xavier Institute of Social Service (XISS)", state: "Jharkhand", district: "Ranchi", aishe_code: "C-4250", nirf_rank: 72, specialization: "Rural Management & Social Entrepreneurship" }
];

const SEED_RESEARCHERS: Researcher[] = [
  { id: 1, name: "Dr. Ananya Sharma", title: "Professor & Head", university_id: 1, department: "Hydrology & Water Resources", email: "ananya.sharma@bitmesra.ac.in", expertise_areas: "Hydrology, Rural Water Systems, Groundwater Remediation, IoT Quality Sensors", publications_count: 42, profile_summary: "20+ years leading field water purification and IoT aquifer monitoring in Chota Nagpur plateau." },
  { id: 2, name: "Dr. Rajeshwar Soren", title: "Associate Professor", university_id: 4, department: "Agronomy & Soil Sciences", email: "r.soren@baujharkhand.org", expertise_areas: "Soil Salinity, Drought-Resilient Millets, Organic Biofertilizer, Micro-irrigation", publications_count: 29, profile_summary: "Specialist in dryland farming regimes and indigenous tribal crop preservation techniques." },
  { id: 3, name: "Dr. Sunita Kujur", title: "Head of Department", university_id: 5, department: "Community & Preventive Medicine", email: "dr.kujur@aiimsdeoghar.edu.in", expertise_areas: "Point-of-Care Diagnostics, Maternal Anemia, Telemedicine Triage, Waterborne Pathogens", publications_count: 36, profile_summary: "Leads state clinical outreach for diagnostic kits in remote tribal blocks." },
  { id: 4, name: "Dr. Vikramaditya Sen", title: "Professor", university_id: 2, department: "Mechanical & Energy Systems", email: "vsen@nitjsr.ac.in", expertise_areas: "Solar Thermal Desalination, Rural Cold Chains, Decentralized Energy", publications_count: 48, profile_summary: "Pioneered decentralized solar milk chillers and community grain dryers for SHGs." },
  { id: 5, name: "Dr. Priya Mahato", title: "Assistant Professor", university_id: 3, department: "Environmental Science & Engineering", email: "priya.m@iitism.ac.in", expertise_areas: "Acid Mine Drainage Remediation, Heavy Metal Biosorption, Fly Ash Utilization", publications_count: 22, profile_summary: "Focuses on industrial effluents filtering and watershed restoration in mining zones." },
  { id: 6, name: "Dr. Manish Tirkey", title: "Associate Professor", university_id: 6, department: "Energy Engineering", email: "manish.tirkey@cuj.ac.in", expertise_areas: "Biomass Briquetting, Off-grid Microgrids, Clean Cookstoves", publications_count: 19, profile_summary: "Designs clean bio-energy technologies using agricultural residues and sal leaf wastes." },
  { id: 7, name: "Dr. Alok Verma", title: "Professor", university_id: 1, department: "Civil & Environmental Engineering", email: "averma@bitmesra.ac.in", expertise_areas: "Solid Waste Pyrolysis, Plastic Road Paving, Municipal GIS", publications_count: 31, profile_summary: "Advisor to Urban Development Dept on decentralized landfill methane abatement." },
  { id: 8, name: "Dr. Meenakshi Roy", title: "Senior Faculty", university_id: 8, department: "Rural Development & Management", email: "meenakshi.roy@xiss.ac.in", expertise_areas: "Tasar Silk Value Chain, Forest Produce Cooperatives, Women SHG Micro-Credit", publications_count: 18, profile_summary: "Designs market linkages and value addition machinery for lac and honey harvesters." },
  { id: 9, name: "Dr. Neha Jha", title: "Senior Researcher", university_id: 6, department: "Water Engineering and Management", email: "neha.jha@cuj.ac.in", expertise_areas: "Rainwater Harvesting Catchments, Sand Dam Filtration, Village Water Auditing", publications_count: 16, profile_summary: "Hydrogeologist specializing in check-dam percolation in basalt terrains." }
];

const SEED_PARTNERS: FundingPartner[] = [
  { id: 1, name: "Tata Steel Foundation (TSDS)", type: "Corporate CSR", csr_focus_areas: "Water & Sanitation, Rural Livelihood, Primary Health, STEM Education", contact_email: "csr.water@tatasteel.com", description: "Pioneering community-first sustainable infrastructure across Kolhan and Chota Nagpur." },
  { id: 2, name: "Coal India CSR / CCL Ranchi", type: "PSU CSR", csr_focus_areas: "Mine Water Treatment, Groundwater Recharge, Skill Development, Village Health", contact_email: "ccl.csr@coalindia.gov.in", description: "Committed to post-mining land restoration and safe potable water in coal-belt villages." },
  { id: 3, name: "NTPC Foundation", type: "PSU CSR", csr_focus_areas: "Clean Energy Access, Rural Piped Water, Agri-Cold Chains", contact_email: "foundation@ntpc.co.in", description: "Enabling rural microgrid access and solar agricultural pumping." },
  { id: 4, name: "Reliance Foundation", type: "Corporate CSR", csr_focus_areas: "Digital Agri-Advisory, Water Security, Nutrition, Rural Enterprise", contact_email: "contact@reliancefoundation.org", description: "Scaling tech-enabled farmer support systems and check-dam water harvesting." },
  { id: 5, name: "Infosys Foundation", type: "Corporate CSR", csr_focus_areas: "Rural Education Infrastructure, Healthcare Diagnostics, Tech for Social Good", contact_email: "csr@infosys.com", description: "Supporting university-led grassroots tech prototypes for public welfare." },
  { id: 6, name: "Vedanta Foundation / ESL Steel", type: "Corporate CSR", csr_focus_areas: "Women Empowerment, Drinking Water, Malnutrition Eradication", contact_email: "esl.csr@vedanta.co.in", description: "Focusing on Bokaro and Dhanbad peripheral village development." },
  { id: 7, name: "Usha Martin CSR Trust", type: "Corporate CSR", csr_focus_areas: "Tasar Silk Clusters, Watershed Management, Vocational Training", contact_email: "csr@ushamartin.com", description: "Supporting tribal weaver collectives and watershed percolation tanks." },
  { id: 8, name: "Adani Foundation", type: "Corporate CSR", csr_focus_areas: "Solar Water ATMs, Community Hospitals, Smart Classrooms", contact_email: "foundation@adani.com", description: "Deploying village-scale reverse osmosis and solar-powered filtration stations." }
];

const SEED_PROBLEMS: Problem[] = [
  {
    id: "BP-2026-00421",
    title: "Drinking Water Shortage and Iron Contamination in Rural Community",
    description: "Residents in Siladon village are travelling over 3 km every morning to fetch muddy stream water because both deep borewells have dried up and the single operational handpump yields brownish, high-iron water that causes stomach illness.",
    category: "Water",
    location: "Siladon Village, Angara Block",
    district: "Ranchi",
    state: "Jharkhand",
    latitude: 23.4124,
    longitude: 85.5412,
    citizen_name: "Raj Kumar",
    is_anonymous: false,
    priority: "High",
    status: "Published",
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    ai_analysis: {
      id: 1,
      problem_id: "BP-2026-00421",
      summary: "Severe potable water deficit with iron contamination causing gastrointestinal ailments in Siladon. Requires solar aeration & bio-filtration.",
      domain: "Water Resources, Hydrology & Environmental Public Health",
      extracted_keywords: "Groundwater Depletion, Solar Water Purification, Iron Contamination, BIS 10500",
      duplicate_info: "2 similar water reports detected in adjoining block panchayats",
      is_duplicate: false,
      priority_suggested: "High",
      research_areas: "Hydrology & Water Engineering, Environmental Science, Public Health Engineering",
      is_live_ai: false,
      confidence_score: 0.96,
      created_at: new Date().toISOString()
    }
  },
  {
    id: "BP-2026-00422",
    title: "Severe Early Blight Fungus Destroying Tomato Yields",
    description: "Over 80 smallholder farmers in Bero block are witnessing black lesions on tomato leaves. Traditional chemical fungicides are failing and nearly 60% of standing crop is rotting before harvest.",
    category: "Agriculture",
    location: "Bero Block, Ranchi District",
    district: "Ranchi",
    state: "Jharkhand",
    latitude: 23.2750,
    longitude: 85.0080,
    citizen_name: "Manoj Mahto",
    is_anonymous: false,
    priority: "High",
    status: "In Research",
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    ai_analysis: {
      id: 2,
      problem_id: "BP-2026-00422",
      summary: "Early blight fungal infection causing severe crop loss in Bero. Botanical fungicides and biocontrol agents needed.",
      domain: "Precision Agronomy, Crop Pathology & Post-Harvest Tech",
      extracted_keywords: "Early Blight, Bio-Botanical Fungicide, Trichoderma viride, Crop Rot",
      duplicate_info: "No duplicate cluster detected within 15 km administrative radius",
      is_duplicate: false,
      priority_suggested: "High",
      research_areas: "Agronomy & Soil Sciences, Agri-Robotics",
      is_live_ai: false,
      confidence_score: 0.94,
      created_at: new Date().toISOString()
    }
  },
  {
    id: "BP-2026-00423",
    title: "Lack of Point-of-Care Maternal Anemia Screening at Sub-Health Center",
    description: "The local auxiliary nurse midwife has no working hemoglobinometer. Pregnant women must travel 28 km over broken roads for routine blood checks, resulting in undetected severe maternal anemia.",
    category: "Health",
    location: "Torpa Block, Khunti District",
    district: "Khunti",
    state: "Jharkhand",
    latitude: 22.9560,
    longitude: 85.0870,
    citizen_name: "Sushila Devi",
    is_anonymous: false,
    priority: "High",
    status: "Government Verified",
    created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    ai_analysis: {
      id: 3,
      problem_id: "BP-2026-00423",
      summary: "Absence of portable non-invasive hemoglobinometer at remote sub-center. Requires handheld optical diagnostic tool.",
      domain: "Rural Healthcare Diagnostics & Community Biomedical Systems",
      extracted_keywords: "Maternal Anemia, Non-Invasive Hemoglobinometer, Point-of-Care, ANM App",
      duplicate_info: "No duplicate cluster detected within 15 km administrative radius",
      is_duplicate: false,
      priority_suggested: "High",
      research_areas: "Biomedical Engineering, Community Medicine",
      is_live_ai: false,
      confidence_score: 0.95,
      created_at: new Date().toISOString()
    }
  },
  {
    id: "BP-2026-00424",
    title: "Frequent Canal Seepage and Unmonitored Water Wastage",
    description: "Earthen branch canal suffers multiple breaches during paddy season, flooding adjacent lowlands while tail-end farmers receive zero irrigation water.",
    category: "Water",
    location: "Ormanjhi Catchment",
    district: "Ranchi",
    state: "Jharkhand",
    latitude: 23.4800,
    longitude: 85.4800,
    citizen_name: "Arjun Oraon",
    is_anonymous: false,
    priority: "Medium",
    status: "Funded",
    created_at: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "BP-2026-00425",
    title: "Post-Harvest Vegetable Spoilage Due to Lack of Grid-Free Cold Storage",
    description: "Farmers in Patamda are forced to distress-sell capsicum and green chillies at Rs 4/kg because village lacks electricity for cold storage during peak summer.",
    category: "Agriculture",
    location: "Patamda Village",
    district: "East Singhbhum",
    state: "Jharkhand",
    latitude: 22.9150,
    longitude: 86.4100,
    citizen_name: "Bikash Soren",
    is_anonymous: false,
    priority: "High",
    status: "Proposal Created",
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "BP-2026-00426",
    title: "Acidic Runoff and Coal Particulate Pollution in Community Stream",
    description: "Runoff from open cast coal dumps is turning the Jharia nullah acidic (pH < 4.5), killing cattle fish and making groundwater in nearby dugwells undrinkable.",
    category: "Environment",
    location: "Bastacolla Area, Jharia",
    district: "Dhanbad",
    state: "Jharkhand",
    latitude: 23.7420,
    longitude: 86.4180,
    citizen_name: "Pooja Burnwal",
    is_anonymous: false,
    priority: "High",
    status: "Validated",
    created_at: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "BP-2026-00427",
    title: "Low Productivity and Physical Strain in Handloom Tasar Silk Reeling",
    description: "Tribal women using traditional thigh-reeling methods suffer physical abrasions and produce uneven yarn thickness, leading to low market realization from weavers.",
    category: "Livelihood",
    location: "Saraikela Kharsawan",
    district: "Saraikela",
    state: "Jharkhand",
    latitude: 22.7000,
    longitude: 85.9300,
    citizen_name: "Rani Hembram",
    is_anonymous: false,
    priority: "Medium",
    status: "Proposal Created",
    created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "BP-2026-00428",
    title: "Unmonitored Municipal Open Dumpsite Causing Toxic Leachate",
    description: "Decentralized collection has broken down. 40 metric tons of wet garbage is dumped in an open field near a school, attracting stray animals and polluting the water table.",
    category: "Civic",
    location: "Ward 12, Hazaribagh",
    district: "Hazaribagh",
    state: "Jharkhand",
    latitude: 23.9930,
    longitude: 85.3620,
    citizen_name: "Deepak Sinha",
    is_anonymous: false,
    priority: "Medium",
    status: "Pending Validation",
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "BP-2026-00429",
    title: "High Fluoride Content in Deep Tube-Well Water Leading to Skeletal Fluorosis",
    description: "School children in Leslieganj block are showing mottled yellow teeth and joint stiffness. Water tests show fluoride levels at 3.8 mg/L against the 1.0 safe limit.",
    category: "Health",
    location: "Leslieganj Block",
    district: "Palamu",
    state: "Jharkhand",
    latitude: 24.0300,
    longitude: 84.2000,
    citizen_name: "Dr. V. K. Dubey",
    is_anonymous: false,
    priority: "High",
    status: "Validated",
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "BP-2026-00430",
    title: "Lack of Vernacular Offline STEM Tools in Non-Electrified Schools",
    description: "Government Middle School lacks regular power and internet. Students struggle to visualize science concepts because textbooks are in standard Hindi while mother tongue is Santhali/Ho.",
    category: "Education",
    location: "Ghatshila Sub-Division",
    district: "East Singhbhum",
    state: "Jharkhand",
    latitude: 22.5800,
    longitude: 86.4800,
    citizen_name: "Sunil Murmu",
    is_anonymous: false,
    priority: "Medium",
    status: "Pending Validation",
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_PROPOSALS: ResearchProposal[] = [
  {
    id: "RPR-2026-0017",
    problem_id: "BP-2026-00421",
    researcher_id: 1,
    title: "Solar-Powered Multi-Stage Aeration & Biosand Water Purification Unit",
    problem_statement: "Deep borewell failure and acute iron/pathogen contamination in Siladon village water sources leading to daily distress travel and gastrointestinal illnesses.",
    proposed_solution: "Deploy a decentralized solar PV-powered cascade aeration tower combined with slow sand-gravel bio-filtration and real-time IoT water quality sensors.",
    methodology: "Phase 1: Hydrogeological aquifer survey; Phase 2: Fabrication of modular filtration prototype at BIT Mesra; Phase 3: Community installation and village water committee training.",
    expected_outcome: "Clean potable water adhering to BIS 10500 standards (< 0.3 mg/L iron) delivering 4,000 liters/day to 1,200 villagers.",
    estimated_timeline_months: 6,
    estimated_budget_inr: 480000,
    required_resources: "Solar panels, filter media, Arduino LoRaWAN sensor node, water testing kits",
    research_team: "Dr. Ananya Sharma (PI), Dr. Sanjay Karmakar (Co-PI), 2 M.Tech Scholars",
    status: "Funded",
    created_at: new Date().toISOString()
  },
  {
    id: "RPR-2026-0018",
    problem_id: "BP-2026-00422",
    researcher_id: 2,
    title: "Indigenous Botanical Bio-Fungicide Formulation for Early Blight Suppression",
    problem_statement: "Chemical fungicide resistance causing massive pre-harvest tomato rot in Bero block.",
    proposed_solution: "Formulate emulsified botanical extracts from Pongamia pinnata and Neem cake combined with Trichoderma viride culture.",
    methodology: "Field trials across 10 demo plots in Bero block with spectral imaging of leaf disease recovery index.",
    expected_outcome: "75% reduction in early blight spread with zero chemical pesticide residues.",
    estimated_timeline_months: 4,
    estimated_budget_inr: 240000,
    required_resources: "Fermentation vat, sprayers, microscopic imaging setup",
    research_team: "Dr. Rajeshwar Soren, 1 Agri Extension Specialist",
    status: "Proposal Submitted",
    created_at: new Date().toISOString()
  },
  {
    id: "RPR-2026-0019",
    problem_id: "BP-2026-00423",
    researcher_id: 3,
    title: "Non-Invasive Optical Hemoglobinometer with Vernacular Mobile Triage for ANMs",
    problem_statement: "Maternal anemia undetected in remote tribal villages due to absence of laboratory testing facilities.",
    proposed_solution: "Low-cost non-invasive finger-sensor LED spectrophotometer connected via Bluetooth to a multilingual ANM tablet app.",
    methodology: "Clinical calibration against gold-standard laboratory spectrophotometry followed by field deployment across 15 Sub-Health Centers.",
    expected_outcome: "Instant 30-second anemia diagnosis with automatic alert to CHC for severe cases (< 7 g/dL).",
    estimated_timeline_months: 5,
    estimated_budget_inr: 350000,
    required_resources: "Optical sensor modules, 15 rugged tablets, calibration kits",
    research_team: "Dr. Sunita Kujur (AIIMS), Dr. Ritu Sinha, 2 Biomedical Tech Assistants",
    status: "Funded",
    created_at: new Date().toISOString()
  }
];

const SEED_OUTCOMES: PublicOutcome[] = [
  {
    id: "OUT-2026-001",
    project_id: "PRJ-2026-003",
    problem_id: "BP-2026-00421",
    proposal_id: "RPR-2026-0017",
    title: "Solar-Powered Drinking Water Purification & Real-Time Quality Monitoring System",
    summary_solution: "Decentralized solar multi-stage aeration and biosand filtration unit delivering 4,000+ liters/day of clean, iron-free drinking water adhering to BIS 10500 standards.",
    original_problem_text: "Recurring acute shortage of safe drinking water and heavy iron contamination forcing villagers to walk over 3 km.",
    location: "Siladon Village, Angara Block, Ranchi District",
    research_institution: "Birla Institute of Technology (BIT) Mesra",
    research_team: "Dr. Ananya Sharma (Lead) & Water Engineering Lab",
    industry_partner: "Tata Steel Foundation (TSDS)",
    deployment_date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    impact_metric: "1,250 citizens provided safe, iron-free potable drinking water daily with 0% gastrointestinal illnesses reported.",
    citizen_contributor_name: "Raj Kumar",
    is_anonymous: false,
    is_published: true,
    published_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "OUT-2026-002",
    project_id: "PRJ-2026-004",
    problem_id: "BP-2026-00423",
    proposal_id: "RPR-2026-0019",
    title: "Portable Non-Invasive Hemoglobinometer for Rural ANM Maternal Care",
    summary_solution: "Optical 30-second rapid finger sensor with multilingual vernacular tablet app eliminating painful needle pricks and lab travel for pregnant rural mothers.",
    original_problem_text: "Lack of point-of-care anemia testing at remote Sub-Health Center resulting in undetected severe maternal complications.",
    location: "Torpa Block, Khunti District",
    research_institution: "AIIMS Deoghar Community Medicine Wing",
    research_team: "Dr. Sunita Kujur & AIIMS Digital Health Group",
    industry_partner: "Infosys Foundation",
    deployment_date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    impact_metric: "890 tribal pregnant mothers screened; 142 severe anemia cases detected and successfully treated.",
    citizen_contributor_name: "Sushila Devi",
    is_anonymous: false,
    is_published: true,
    published_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  }
];

const SEED_PROJECTS: Project[] = [
  {
    id: "PRJ-2026-003",
    proposal_id: "RPR-2026-0017",
    problem_id: "BP-2026-00421",
    title: "Solar-Powered Community Water Filtration & Monitoring Station",
    status: "Published",
    deployment_location: "Siladon Village, Angara Block, Ranchi",
    beneficiaries_count: 1250,
    pilot_metrics: "Iron reduced from 3.6 mg/L to 0.18 mg/L; 4,200 Liters purified daily; zero downtime over 90 days.",
    start_date: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "PRJ-2026-004",
    proposal_id: "RPR-2026-0019",
    problem_id: "BP-2026-00423",
    title: "Field Pilot: Optical Hemoglobinometer for Tribal ANMs",
    status: "Government Verified",
    deployment_location: "Torpa Block, Khunti",
    beneficiaries_count: 890,
    pilot_metrics: "890 pregnant women screened; 142 severe anemia cases flagged and treated early; 98.4% clinical correlation with lab tests.",
    start_date: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString()
  }
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, title: "New Problem BP-2026-00428 Submitted", message: "Open Dumpsite in Hazaribagh awaiting District 48h SLA validation.", type: "warning", target_role: "district", related_id: "BP-2026-00428", is_read: false, created_at: new Date().toISOString() },
  { id: 2, title: "Problem BP-2026-00421 Validated", message: "District Planning Officer approved 'Drinking Water Shortage in Rural Community' for research matching.", type: "success", target_role: "all", related_id: "BP-2026-00421", is_read: false, created_at: new Date().toISOString() },
  { id: 3, title: "Research Match Found", message: "Dr. Ananya Sharma (BIT Mesra) matched with 94% relevance score to BP-2026-00421.", type: "match", target_role: "researcher", related_id: "BP-2026-00421", is_read: false, created_at: new Date().toISOString() },
  { id: 4, title: "Solution Proposed by University", message: "BIT Mesra submitted proposal RPR-2026-0017 for Siladon drinking water.", type: "info", target_role: "district", related_id: "RPR-2026-0017", is_read: false, created_at: new Date().toISOString() },
  { id: 5, title: "CSR Grant Approved", message: "Tata Steel Foundation pledged INR 5,00,000 for proposal RPR-2026-0017.", type: "success", target_role: "industry", related_id: "RPR-2026-0017", is_read: false, created_at: new Date().toISOString() }
];

const SEED_EMAILS: SimulatedEmail[] = [
  {
    id: 1,
    sender: "notifications@bharat-panchyt.gov.in",
    recipient: "ananya.sharma@bitmesra.ac.in",
    recipient_role: "Researcher",
    subject: "Research Match Found: Drinking Water Shortage in Angara (BP-2026-00421)",
    body: "Dear Dr. Ananya Sharma,\n\nA validated citizen problem matching your expertise in Hydrology & Rural Water Systems has entered the BHARAT-PANCHYT innovation pipeline.\n\nProblem ID: BP-2026-00421\nLocation: Siladon Village, Angara Block, Ranchi\nMatch Score: 94%\n\nPlease review the problem details and create a Research Proposal to connect with CSR funding.",
    action_label: "Review Problem & Propose",
    action_route: "/research-matching",
    created_at: new Date().toISOString()
  }
];

class MockStore {
  private data: {
    problems: Problem[];
    universities: University[];
    researchers: Researcher[];
    matches: ExpertiseMatch[];
    proposals: ResearchProposal[];
    partners: FundingPartner[];
    fundingInterests: FundingInterest[];
    projects: Project[];
    outcomes: PublicOutcome[];
    notifications: NotificationItem[];
    emails: SimulatedEmail[];
  };

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          Array.isArray(parsed.problems) &&
          parsed.problems.length >= 10 &&
          Array.isArray(parsed.researchers) &&
          parsed.researchers.length > 0
        ) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read localStorage, initializing seed data.");
    }

    // Default Seed Data
    const initial = {
      problems: SEED_PROBLEMS,
      universities: SEED_UNIVERSITIES,
      researchers: SEED_RESEARCHERS,
      matches: [
        {
          id: 1,
          problem_id: "BP-2026-00421",
          researcher_id: 1,
          match_score: 94,
          match_reason: "Direct research alignment in Hydrology & Water Resources focusing on groundwater and rural water systems.",
          status: "Matched",
          created_at: new Date().toISOString(),
          researcher: SEED_RESEARCHERS[0],
          problem: SEED_PROBLEMS[0]
        },
        {
          id: 2,
          problem_id: "BP-2026-00422",
          researcher_id: 2,
          match_score: 93,
          match_reason: "Specialist in crop pathology, organic biofertilizers, and early blight suppression.",
          status: "Matched",
          created_at: new Date().toISOString(),
          researcher: SEED_RESEARCHERS[1],
          problem: SEED_PROBLEMS[1]
        }
      ],
      proposals: SEED_PROPOSALS.map(p => ({
        ...p,
        researcher: SEED_RESEARCHERS.find(r => r.id === p.researcher_id),
        problem: SEED_PROBLEMS.find(pr => pr.id === p.problem_id)
      })),
      partners: SEED_PARTNERS,
      fundingInterests: [
        {
          id: 1,
          proposal_id: "RPR-2026-0017",
          partner_id: 1,
          funding_amount_inr: 500000,
          funding_type: "CSR Grant",
          csr_focus_alignment: "Water & Sanitation Mandate (Schedule VII)",
          why_match: "Tata Steel Foundation has an active rural drinking water security mandate in Angara block.",
          mentorship_offered: true,
          milestones: "Milestone 1: Hydrogeological survey; Milestone 2: Filter installation; Milestone 3: Handover.",
          status: "Approved",
          created_at: new Date().toISOString(),
          partner: SEED_PARTNERS[0]
        }
      ],
      projects: SEED_PROJECTS.map(pj => ({
        ...pj,
        problem: SEED_PROBLEMS.find(p => p.id === pj.problem_id),
        proposal: SEED_PROPOSALS.find(pr => pr.id === pj.proposal_id)
      })),
      outcomes: SEED_OUTCOMES,
      notifications: SEED_NOTIFICATIONS,
      emails: SEED_EMAILS
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch (e) {
      console.warn("Could not save to localStorage.");
    }
    return initial;
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Could not persist to localStorage.");
    }
  }

  // API Methods
  getProblems(params?: { category?: string; status?: string; search?: string }) {
    let list = [...this.data.problems];
    if (params?.category && params.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.status && params.status !== 'All') {
      list = list.filter(p => p.status.toLowerCase() === params.status!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    return list;
  }

  getProblem(id: string) {
    return this.data.problems.find(p => p.id === id) || null;
  }

  createProblem(payload: {
    title: string;
    description: string;
    location: string;
    district: string;
    citizen_name?: string;
    is_anonymous: boolean;
  }): Problem {
    // Intelligent Multilingual Semantic Classification
    const aiResult = classifyProblemSemantics(payload.title, payload.description, payload.location);

    const count = this.data.problems.length + 1;
    const newId = `BP-2026-${String(count + 430).padStart(5, '0')}`;
    const now = new Date().toISOString();

    const newProblem: Problem = {
      id: newId,
      title: payload.title,
      description: payload.description,
      category: aiResult.category,
      location: payload.location,
      district: payload.district || 'Ranchi',
      state: 'Jharkhand',
      citizen_name: payload.is_anonymous ? 'Anonymous' : (payload.citizen_name || 'Citizen Contributor'),
      is_anonymous: payload.is_anonymous,
      priority: aiResult.priority,
      status: 'Pending Validation',
      created_at: now,
      updated_at: now,
      ai_analysis: {
        id: this.data.problems.length + 10,
        problem_id: newId,
        summary: aiResult.summary,
        domain: aiResult.domain,
        extracted_keywords: aiResult.extracted_keywords,
        duplicate_info: aiResult.duplicate_info,
        is_duplicate: false,
        priority_suggested: aiResult.priority,
        research_areas: aiResult.research_areas,
        is_live_ai: false,
        confidence_score: aiResult.confidence_score,
        created_at: now
      }
    };

    this.data.problems.unshift(newProblem);

    // Create Notification specifically for District Officer!
    const notif: NotificationItem = {
      id: Date.now(),
      title: `New Problem Submitted: ${newId}`,
      message: `Citizen reported '${payload.title.slice(0, 45)}...' in ${payload.district}. Classified as ${aiResult.category}. Awaiting 48h SLA validation.`,
      type: 'info',
      target_role: 'district',
      related_id: newId,
      is_read: false,
      created_at: now
    };
    this.data.notifications.unshift(notif);

    this.saveToStorage();
    return newProblem;
  }

  recordValidation(payload: {
    problem_id: string;
    officer_name?: string;
    district: string;
    action: string;
    notes?: string;
  }) {
    const prob = this.data.problems.find(p => p.id === payload.problem_id);
    if (!prob) throw new Error("Problem not found");

    const now = new Date().toISOString();
    prob.status = payload.action === 'Approved' ? 'Validated' : (payload.action === 'Rejected' ? 'Rejected' : 'Info Requested');
    prob.updated_at = now;

    if (payload.action === 'Approved') {
      // Find relevant researchers
      const researchers = this.data.researchers;
      const matchedRes = researchers.find(r => r.department.toLowerCase().includes(prob.category.toLowerCase())) || researchers[0];

      // Add match
      const newMatch: ExpertiseMatch = {
        id: Date.now(),
        problem_id: prob.id,
        researcher_id: matchedRes.id,
        match_score: 95,
        match_reason: `Strong departmental alignment in ${matchedRes.department} matching ${prob.category} community challenge.`,
        status: "Matched",
        created_at: now,
        researcher: matchedRes,
        problem: prob
      };
      this.data.matches.unshift(newMatch);

      // Notification to researchers
      this.data.notifications.unshift({
        id: Date.now() + 1,
        title: `Problem ${prob.id} Validated`,
        message: `District Officer approved '${prob.title.slice(0, 40)}...'. Auto-matched with ${matchedRes.name} (${matchedRes.university_id === 1 ? 'BIT Mesra' : 'Lead University'}).`,
        type: 'match',
        target_role: 'researcher',
        related_id: prob.id,
        is_read: false,
        created_at: now
      });

      // Notification to District Officer
      this.data.notifications.unshift({
        id: Date.now() + 2,
        title: `Validation Logged: ${prob.id}`,
        message: `Ground verification confirmed. Problem dispatched to Higher Education Research pipeline.`,
        type: 'success',
        target_role: 'district',
        related_id: prob.id,
        is_read: false,
        created_at: now
      });
    }

    this.saveToStorage();
    return { status: "success", action: payload.action };
  }

  createProposal(payload: {
    problem_id: string;
    researcher_id: number;
    title: string;
    problem_statement: string;
    proposed_solution: string;
    methodology: string;
    expected_outcome: string;
    estimated_timeline_months: number;
    estimated_budget_inr: number;
    required_resources?: string;
    research_team?: string;
  }): ResearchProposal {
    const propCount = this.data.proposals.length + 1;
    const propId = `RPR-2026-${String(propCount + 20).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const researcher = this.data.researchers.find(r => r.id === payload.researcher_id) || this.data.researchers[0];
    const problem = this.data.problems.find(p => p.id === payload.problem_id);

    const newProp: ResearchProposal = {
      id: propId,
      problem_id: payload.problem_id,
      researcher_id: payload.researcher_id,
      title: payload.title,
      problem_statement: payload.problem_statement,
      proposed_solution: payload.proposed_solution,
      methodology: payload.methodology,
      expected_outcome: payload.expected_outcome,
      estimated_timeline_months: payload.estimated_timeline_months,
      estimated_budget_inr: payload.estimated_budget_inr,
      required_resources: payload.required_resources,
      research_team: payload.research_team,
      status: "Proposal Submitted",
      created_at: now,
      researcher,
      problem
    };

    if (problem) {
      problem.status = 'Proposal Created';
      problem.updated_at = now;
    }

    this.data.proposals.unshift(newProp);

    // Notify District Officer that university proposed a solution!
    this.data.notifications.unshift({
      id: Date.now(),
      title: `Proposed Solution Received: ${propId}`,
      message: `${researcher.name} (${researcher.university_id === 1 ? 'BIT Mesra' : 'University'}) formulated a solution for ${payload.problem_id}.`,
      type: 'info',
      target_role: 'district',
      related_id: propId,
      is_read: false,
      created_at: now
    });

    // Notify Industry / CSR
    this.data.notifications.unshift({
      id: Date.now() + 1,
      title: `New Proposal Ready for CSR Funding: ${propId}`,
      message: `Budget INR ${payload.estimated_budget_inr.toLocaleString('en-IN')} requested for ${payload.title.slice(0, 40)}...`,
      type: 'info',
      target_role: 'industry',
      related_id: propId,
      is_read: false,
      created_at: now
    });

    this.saveToStorage();
    return newProp;
  }

  recordFundingOffer(payload: {
    proposal_id: string;
    partner_id: number;
    funding_amount_inr: number;
    funding_type: string;
    csr_focus_alignment?: string;
    why_match?: string;
    mentorship_offered: boolean;
    milestones?: string;
  }): FundingInterest {
    const prop = this.data.proposals.find(p => p.id === payload.proposal_id);
    const partner = this.data.partners.find(pt => pt.id === payload.partner_id) || this.data.partners[0];
    const now = new Date().toISOString();

    const newInterest: FundingInterest = {
      id: Date.now(),
      proposal_id: payload.proposal_id,
      partner_id: payload.partner_id,
      funding_amount_inr: payload.funding_amount_inr,
      funding_type: payload.funding_type,
      csr_focus_alignment: payload.csr_focus_alignment,
      why_match: payload.why_match,
      mentorship_offered: payload.mentorship_offered,
      milestones: payload.milestones,
      status: "Approved",
      created_at: now,
      partner,
      proposal: prop
    };

    if (prop) {
      prop.status = 'Funded';
      if (prop.problem) {
        prop.problem.status = 'Funded';
      }

      // Auto-create Project in Government pipeline
      const projId = `PRJ-2026-${String(this.data.projects.length + 10).padStart(3, '0')}`;
      const newProj: Project = {
        id: projId,
        proposal_id: prop.id,
        problem_id: prop.problem_id,
        title: prop.title,
        status: "Field Pilot",
        deployment_location: prop.problem?.location || "Jharkhand Rural Cluster",
        beneficiaries_count: 950,
        pilot_metrics: "Prototype fabricated in university lab; solar components and telemetry installed in village.",
        start_date: now,
        proposal: prop,
        problem: prop.problem
      };
      this.data.projects.unshift(newProj);
    }

    this.data.fundingInterests.unshift(newInterest);

    // Notifications
    this.data.notifications.unshift({
      id: Date.now(),
      title: `Funding Pledged: INR ${payload.funding_amount_inr.toLocaleString('en-IN')}`,
      message: `${partner.name} approved grant for proposal ${payload.proposal_id}. Field deployment initiated!`,
      type: 'success',
      target_role: 'all',
      related_id: payload.proposal_id,
      is_read: false,
      created_at: now
    });

    this.saveToStorage();
    return newInterest;
  }

  verifyProject(projectId: string, payload: { verifier_name: string; audit_findings: string }) {
    const proj = this.data.projects.find(p => p.id === projectId);
    if (proj) {
      proj.status = 'Government Verified';
      if (proj.problem) {
        proj.problem.status = 'Government Verified';
      }
    }

    this.data.notifications.unshift({
      id: Date.now(),
      title: `Government Verified: ${projectId}`,
      message: `${payload.verifier_name} certified field results. Ready for Public Registry!`,
      type: 'success',
      target_role: 'government',
      related_id: projectId,
      is_read: false,
      created_at: new Date().toISOString()
    });

    this.saveToStorage();
    return { status: "success", message: "Deployment verified successfully" };
  }

  publishOutcome(projectId: string, payload: { title?: string; summary_solution?: string; impact_metric?: string }): PublicOutcome {
    const proj = this.data.projects.find(p => p.id === projectId);
    const count = this.data.outcomes.length + 1;
    const outId = `OUT-2026-${String(count + 15).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const problem = proj?.problem || this.data.problems[0];
    const proposal = proj?.proposal || this.data.proposals[0];
    const researcher = proposal?.researcher || this.data.researchers[0];

    const outcome: PublicOutcome = {
      id: outId,
      project_id: projectId,
      problem_id: problem.id,
      proposal_id: proposal.id,
      title: payload.title || proj?.title || "Community Innovation Solution",
      summary_solution: payload.summary_solution || proposal.proposed_solution,
      original_problem_text: problem.description,
      location: proj?.deployment_location || problem.location,
      research_institution: researcher.university_id === 1 ? "Birla Institute of Technology (BIT) Mesra" : "Lead State University",
      research_team: proposal.research_team || researcher.name,
      industry_partner: "Tata Steel Foundation (TSDS)",
      deployment_date: now,
      impact_metric: payload.impact_metric || `${proj?.beneficiaries_count || 1200} citizens directly benefited with certified outcomes.`,
      citizen_contributor_name: problem.citizen_name || "Anonymous",
      is_anonymous: problem.is_anonymous,
      is_published: true,
      published_at: now
    };

    if (proj) proj.status = 'Published';
    if (problem) problem.status = 'Published';

    this.data.outcomes.unshift(outcome);

    this.data.notifications.unshift({
      id: Date.now(),
      title: `Public Outcome Published: ${outId}`,
      message: `Solution live in Registry. Honoring Citizen Contributor: ${outcome.citizen_contributor_name}.`,
      type: 'success',
      target_role: 'all',
      related_id: outId,
      is_read: false,
      created_at: now
    });

    this.saveToStorage();
    return outcome;
  }

  getResearchers(search?: string) {
    if (!search) return this.data.researchers;
    const q = search.toLowerCase();
    return this.data.researchers.filter(r => r.name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.expertise_areas.toLowerCase().includes(q));
  }

  getMatches(params?: { problem_id?: string; researcher_id?: number }) {
    let list = this.data.matches;
    if (params?.problem_id) {
      list = list.filter(m => m.problem_id === params.problem_id);
    }
    if (params?.researcher_id) {
      list = list.filter(m => m.researcher_id === params.researcher_id);
    }
    return list;
  }

  getProposals(status?: string) {
    if (!status || status === 'All') return this.data.proposals;
    return this.data.proposals.filter(p => p.status === status);
  }

  getCSRPartners() {
    return this.data.partners;
  }

  getFundingInterests(proposalId?: string) {
    if (!proposalId) return this.data.fundingInterests;
    return this.data.fundingInterests.filter(f => f.proposal_id === proposalId);
  }

  getProjects(status?: string) {
    if (!status || status === 'All') return this.data.projects;
    return this.data.projects.filter(p => p.status === status);
  }

  getPublicOutcomes() {
    return this.data.outcomes;
  }

  getNotifications() {
    return this.data.notifications;
  }

  markNotificationRead(id: number) {
    const n = this.data.notifications.find(nt => nt.id === id);
    if (n) n.is_read = true;
    this.saveToStorage();
  }

  markAllNotificationsRead() {
    this.data.notifications.forEach(n => { n.is_read = true; });
    this.saveToStorage();
    return this.data.notifications;
  }

  getSimulatedEmails() {
    return this.data.emails;
  }

  getStats(): EcosystemStats {
    const total_problems = this.data.problems.length;
    const validated_problems = this.data.problems.filter(p => !['Submitted', 'Pending Validation', 'Rejected'].includes(p.status)).length;
    const research_matches = this.data.matches.length;
    const proposals_submitted = this.data.proposals.length;
    const funded_projects = this.data.proposals.filter(p => ['Funded', 'In Execution'].includes(p.status)).length;
    const deployed_innovations = this.data.projects.filter(p => ['Deployed', 'Government Verified', 'Published'].includes(p.status)).length;
    const public_outcomes = this.data.outcomes.length;

    const catMap: Record<string, number> = {};
    for (const p of this.data.problems) {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    }
    const category_distribution = Object.entries(catMap).map(([name, count]) => ({ name, count }));

    return {
      kpis: {
        total_problems,
        validated_problems,
        research_matches,
        proposals_submitted,
        funded_projects,
        deployed_innovations,
        public_outcomes
      },
      category_distribution,
      district_distribution: [
        { district: 'Ranchi', count: 12 },
        { district: 'East Singhbhum', count: 5 },
        { district: 'Dhanbad', count: 4 },
        { district: 'Khunti', count: 3 }
      ],
      disclaimer: "Client-Side Standalone Data Store • 100% Functional on Vercel"
    };
  }

  resetStore() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.loadFromStorage();
    return { status: "success", message: "Store reinitialized with fresh demo data!" };
  }
}

export const mockStore = new MockStore();
