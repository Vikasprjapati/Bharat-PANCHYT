import datetime
from sqlalchemy.orm import Session
import models

def seed_database(db: Session):
    # Check if already seeded
    if db.query(models.University).first() is not None:
        return

    now = datetime.datetime.utcnow()

    # 1. Universities (8+)
    universities_data = [
        {"name": "Birla Institute of Technology (BIT) Mesra", "district": "Ranchi", "aishe_code": "U-0245", "nirf_rank": 53, "specialization": "Engineering, Hydrology & Remote Sensing"},
        {"name": "National Institute of Technology (NIT) Jamshedpur", "district": "East Singhbhum", "aishe_code": "U-0247", "nirf_rank": 86, "specialization": "Materials, Water Tech & Smart Manufacturing"},
        {"name": "Indian Institute of Technology (ISM) Dhanbad", "district": "Dhanbad", "aishe_code": "U-0246", "nirf_rank": 14, "specialization": "Earth Sciences, Mining & Environmental Eng"},
        {"name": "Birsa Agricultural University (BAU)", "district": "Ranchi", "aishe_code": "U-0248", "nirf_rank": 41, "specialization": "Agronomy, Soil Sciences & Forestry"},
        {"name": "All India Institute of Medical Sciences (AIIMS) Deoghar", "district": "Deoghar", "aishe_code": "U-0982", "nirf_rank": 35, "specialization": "Community Medicine & Rural Health Diagnostics"},
        {"name": "Central University of Jharkhand (CUJ)", "district": "Ranchi", "aishe_code": "U-0250", "nirf_rank": 105, "specialization": "Energy Engineering & Environmental Science"},
        {"name": "Ranchi University", "district": "Ranchi", "aishe_code": "U-0249", "nirf_rank": 120, "specialization": "Applied Sciences & Tribal Livelihoods"},
        {"name": "Xavier Institute of Social Service (XISS)", "district": "Ranchi", "aishe_code": "C-4250", "nirf_rank": 72, "specialization": "Rural Management & Social Entrepreneurship"}
    ]
    univ_objs = {}
    for u in universities_data:
        obj = models.University(**u)
        db.add(obj)
        db.flush()
        univ_objs[u["name"]] = obj

    # 2. Researchers (15+)
    researchers_data = [
        {"name": "Dr. Ananya Sharma", "title": "Professor & Head", "univ": "Birla Institute of Technology (BIT) Mesra", "dept": "Hydrology & Water Resources", "email": "ananya.sharma@bitmesra.ac.in", "areas": "Hydrology, Rural Water Systems, Groundwater Remediation, IoT Quality Sensors", "pub": 42, "summary": "20+ years leading field water purification and IoT-enabled aquifer monitoring in Chota Nagpur plateau."},
        {"name": "Dr. Rajeshwar Soren", "title": "Associate Professor", "univ": "Birsa Agricultural University (BAU)", "dept": "Agronomy & Soil Sciences", "email": "r.soren@baujharkhand.org", "areas": "Soil Salinity, Drought-Resilient Millets, Organic Biofertilizer, Micro-irrigation", "pub": 29, "summary": "Specialist in dryland farming regimes and indigenous tribal crop preservation techniques."},
        {"name": "Dr. Sunita Kujur", "title": "Head of Department", "univ": "All India Institute of Medical Sciences (AIIMS) Deoghar", "dept": "Community & Preventive Medicine", "email": "dr.kujur@aiimsdeoghar.edu.in", "areas": "Point-of-Care Diagnostics, Maternal Anemia, Telemedicine Triage, Waterborne Pathogens", "pub": 36, "summary": "Leads state clinical outreach for diagnostic kits in remote tribal blocks."},
        {"name": "Dr. Vikramaditya Sen", "title": "Professor", "univ": "National Institute of Technology (NIT) Jamshedpur", "dept": "Mechanical & Energy Systems", "email": "vsen@nitjsr.ac.in", "areas": "Solar Thermal Desalination, Rural Cold Chains, Decentralized Energy", "pub": 48, "summary": "Pioneered decentralized solar milk chillers and community grain dryers for SHGs."},
        {"name": "Dr. Priya Mahato", "title": "Assistant Professor", "univ": "Indian Institute of Technology (ISM) Dhanbad", "dept": "Environmental Science & Engineering", "email": "priya.m@iitism.ac.in", "areas": "Acid Mine Drainage Remediation, Heavy Metal Biosorption, Fly Ash Utilization", "pub": 22, "summary": "Focuses on industrial effluents filtering and watershed restoration in mining zones."},
        {"name": "Dr. Manish Tirkey", "title": "Associate Professor", "univ": "Central University of Jharkhand (CUJ)", "dept": "Energy Engineering", "email": "manish.tirkey@cuj.ac.in", "areas": "Biomass Briquetting, Off-grid Microgrids, Clean Cookstoves", "pub": 19, "summary": "Designs clean bio-energy technologies using agricultural residues and sal leaf wastes."},
        {"name": "Dr. Alok Verma", "title": "Professor", "univ": "Birla Institute of Technology (BIT) Mesra", "dept": "Civil & Environmental Engineering", "email": "averma@bitmesra.ac.in", "areas": "Solid Waste Pyrolysis, Plastic Road Paving, Municipal GIS", "pub": 31, "summary": "Advisor to Urban Development Dept on decentralized landfill methane abatement."},
        {"name": "Dr. Meenakshi Roy", "title": "Senior Faculty", "univ": "Xavier Institute of Social Service (XISS)", "dept": "Rural Development & Management", "email": "meenakshi.roy@xiss.ac.in", "areas": "Tasar Silk Value Chain, Forest Produce Cooperatives, Women SHG Micro-Credit", "pub": 18, "summary": "Designs market linkages and value addition machinery for lac and honey harvesters."},
        {"name": "Dr. Devendra Prasad", "title": "Professor", "univ": "Ranchi University", "dept": "Botany & Herbal Sciences", "email": "dprasad@ranchiuniv.ac.in", "areas": "Ethno-botany, Herbal Drug Formulations, Forest Soil Ecology", "pub": 27, "summary": "Cataloguing medicinal plants and anti-fungal botanical sprays for tribal farmers."},
        {"name": "Dr. Kaushik Banerjee", "title": "Associate Professor", "univ": "National Institute of Technology (NIT) Jamshedpur", "dept": "Computer Science & Engineering", "email": "kbanerjee@nitjsr.ac.in", "areas": "Edge AI, Agritech Drone Vision, IoT Telemetry, Low-power Embedded Sensors", "pub": 34, "summary": "Builds localized smartphone pest classification models for vernacular farmer apps."},
        {"name": "Dr. Ritu Sinha", "title": "Associate Professor", "univ": "All India Institute of Medical Sciences (AIIMS) Deoghar", "dept": "Biochemistry & Pathology", "email": "ritu.sinha@aiimsdeoghar.edu.in", "areas": "Fluoride Toxicity Biomarkers, Rapid Water Testing Strips, Sickle Cell Screening", "pub": 25, "summary": "Developing paper-based colorimetric tests for arsenic and fluoride contamination."},
        {"name": "Dr. Amitesh Kumar", "title": "Professor", "univ": "Indian Institute of Technology (ISM) Dhanbad", "dept": "Mining & Geotechnical Engineering", "email": "amitesh@iitism.ac.in", "areas": "Slope Stability, Geo-hazard Early Warning, Subsidence Monitoring", "pub": 41, "summary": "Implements satellite InSAR and sensor tripwires for village landslide alert systems."},
        {"name": "Dr. Hemlata Baskey", "title": "Assistant Professor", "univ": "Birsa Agricultural University (BAU)", "dept": "Horticulture & Post-Harvest", "email": "h.baskey@baujharkhand.org", "areas": "Solar Dehydration of Vegetables, Mahua Fruit Preservation, Cold Storage", "pub": 15, "summary": "Invented solar tunnel dryers reducing tomato post-harvest gluts by 70% in Ranchi."},
        {"name": "Dr. Sanjay Karmakar", "title": "Professor", "univ": "Birla Institute of Technology (BIT) Mesra", "dept": "Electronics & Communication", "email": "skarmakar@bitmesra.ac.in", "areas": "LoRaWAN Sensor Networks, Smart Water Metering, Rural Broadband Mesh", "pub": 39, "summary": "Pioneered battery-less telemetry tags for rural canal flow monitoring."},
        {"name": "Dr. Neha Jha", "title": "Senior Researcher", "univ": "Central University of Jharkhand (CUJ)", "dept": "Water Engineering and Management", "email": "neha.jha@cuj.ac.in", "areas": "Rainwater Harvesting Catchments, Sand Dam Filtration, Village Water Auditing", "pub": 16, "summary": "Hands-on hydrogeologist specializing in check-dam percolation in basalt terrains."}
    ]
    res_objs = []
    for r in researchers_data:
        univ_id = univ_objs[r["univ"]].id
        obj = models.Researcher(
            name=r["name"], title=r["title"], university_id=univ_id,
            department=r["dept"], email=r["email"], expertise_areas=r["areas"],
            publications_count=r["pub"], profile_summary=r["summary"]
        )
        db.add(obj)
        db.flush()
        res_objs.append(obj)

    # 3. Industry / CSR Partners (8+)
    csr_partners_data = [
        {"name": "Tata Steel Foundation (TSDS)", "type": "Corporate CSR", "areas": "Water & Sanitation, Rural Livelihood, Primary Health, STEM Education", "email": "csr.water@tatasteel.com", "desc": "Pioneering community-first sustainable infrastructure across Kolhan and Chota Nagpur."},
        {"name": "Coal India CSR / CCL Ranchi", "type": "PSU CSR", "areas": "Mine Water Treatment, Groundwater Recharge, Skill Development, Village Health", "email": "ccl.csr@coalindia.gov.in", "desc": "Committed to post-mining land restoration and safe potable water in coal-belt villages."},
        {"name": "NTPC Foundation", "type": "PSU CSR", "areas": "Clean Energy Access, Rural Piped Water, Agri-Cold Chains", "email": "foundation@ntpc.co.in", "desc": "Enabling rural microgrid access and solar agricultural pumping."},
        {"name": "Reliance Foundation", "type": "Corporate CSR", "areas": "Digital Agri-Advisory, Water Security, Nutrition, Rural Enterprise", "email": "contact@reliancefoundation.org", "desc": "Scaling tech-enabled farmer support systems and check-dam water harvesting."},
        {"name": "Infosys Foundation", "type": "Corporate CSR", "areas": "Rural Education Infrastructure, Healthcare Diagnostics, Tech for Social Good", "email": "csr@infosys.com", "desc": "Supporting university-led grassroots tech prototypes for public welfare."},
        {"name": "Vedanta Foundation / ESL Steel", "type": "Corporate CSR", "areas": "Women Empowerment, Drinking Water, Malnutrition Eradication", "email": "esl.csr@vedanta.co.in", "desc": "Focusing on Bokaro and Dhanbad peripheral village development."},
        {"name": "Usha Martin CSR Trust", "type": "Corporate CSR", "areas": "Tasar Silk Clusters, Watershed Management, Vocational Training", "email": "csr@ushamartin.com", "desc": "Supporting tribal weaver collectives and watershed percolation tanks."},
        {"name": "Adani Foundation", "type": "Corporate CSR", "areas": "Solar Water ATMs, Community Hospitals, Smart Classrooms", "email": "foundation@adani.com", "desc": "Deploying village-scale reverse osmosis and solar-powered filtration stations."}
    ]
    csr_objs = []
    for c in csr_partners_data:
        obj = models.FundingPartner(
            name=c["name"], type=c["type"], csr_focus_areas=c["areas"],
            contact_email=c["email"], description=c["desc"]
        )
        db.add(obj)
        db.flush()
        csr_objs.append(obj)

    # 4. Seeded Citizen Problems (20+)
    # Include the primary demo case BP-2026-00421
    problems_data = [
        {
            "id": "BP-2026-00421",
            "title": "Drinking Water Shortage and Iron Contamination in Rural Community",
            "description": "Residents in Siladon village are travelling over 3 km every morning to fetch muddy stream water because both deep borewells have dried up and the single operational handpump yields brownish, high-iron water that causes stomach illness.",
            "category": "Water", "location": "Siladon Village, Angara Block", "district": "Ranchi",
            "latitude": 23.4124, "longitude": 85.5412, "citizen_name": "Raj Kumar", "is_anonymous": False,
            "priority": "High", "status": "Published", "sla_hours": 14.2
        },
        {
            "id": "BP-2026-00422",
            "title": "Severe Early Blight Fungus Destroying Tomato Yields",
            "description": "Over 80 smallholder farmers in Bero block are witnessing black lesions on tomato leaves. Traditional chemical fungicides are failing and nearly 60% of standing crop is rotting before harvest.",
            "category": "Agriculture", "location": "Bero Block, Ranchi District", "district": "Ranchi",
            "latitude": 23.2750, "longitude": 85.0080, "citizen_name": "Manoj Mahto", "is_anonymous": False,
            "priority": "High", "status": "In Research", "sla_hours": 22.0
        },
        {
            "id": "BP-2026-00423",
            "title": "Lack of Point-of-Care Maternal Anemia Screening at Sub-Health Center",
            "description": "The local auxiliary nurse midwife has no working hemoglobinometer. Pregnant women must travel 28 km over broken roads to the district hospital for routine blood checks, resulting in undetected severe anemia.",
            "category": "Health", "location": "Torpa Block, Khunti District", "district": "Khunti",
            "latitude": 22.9560, "longitude": 85.0870, "citizen_name": "Sushila Devi", "is_anonymous": False,
            "priority": "High", "status": "Government Verified", "sla_hours": 18.5
        },
        {
            "id": "BP-2026-00424",
            "title": "Frequent Canal Seepage and Unmonitored Water Wastage",
            "description": "Earthen branch canal suffers multiple breaches during paddy season, flooding adjacent lowlands while tail-end farmers receive zero irrigation water.",
            "category": "Water", "location": "Ormanjhi Catchment", "district": "Ranchi",
            "latitude": 23.4800, "longitude": 85.4800, "citizen_name": "Arjun Oraon", "is_anonymous": False,
            "priority": "Medium", "status": "Funded", "sla_hours": 26.0
        },
        {
            "id": "BP-2026-00425",
            "title": "Post-Harvest Vegetable Spoilage Due to Lack of Grid-Free Cold Storage",
            "description": "Farmers in Patamda are forced to distress-sell capsicum and green chillies at Rs 4/kg because village lacks electricity for cold storage during peak summer.",
            "category": "Agriculture", "location": "Patamda Village", "district": "East Singhbhum",
            "latitude": 22.9150, "longitude": 86.4100, "citizen_name": "Bikash Soren", "is_anonymous": False,
            "priority": "High", "status": "Proposal Created", "sla_hours": 31.0
        },
        {
            "id": "BP-2026-00426",
            "title": "Acidic Runoff and Coal Particulate Pollution in Stream",
            "description": "Runoff from open cast coal dumps is turning the Jharia nullah acidic (pH < 4.5), killing cattle fish and making groundwater in nearby dugwells undrinkable.",
            "category": "Environment", "location": "Bastacolla Area, Jharia", "district": "Dhanbad",
            "latitude": 23.7420, "longitude": 86.4180, "citizen_name": "Pooja Burnwal", "is_anonymous": False,
            "priority": "High", "status": "Validated", "sla_hours": 19.4
        },
        {
            "id": "BP-2026-00427",
            "title": "Low Productivity and High Splitting in Handloom Tasar Silk Reeling",
            "description": "Tribal women using traditional thigh-reeling methods suffer physical abrasions and produce uneven yarn thickness, leading to low market realization from weavers.",
            "category": "Livelihood", "location": "Saraikela Kharsawan", "district": "Saraikela",
            "latitude": 22.7000, "longitude": 85.9300, "citizen_name": "Rani Hembram", "is_anonymous": False,
            "priority": "Medium", "status": "Proposal Created", "sla_hours": 36.0
        },
        {
            "id": "BP-2026-00428",
            "title": "Unmonitored Municipal Open Dumpsite Causing Toxic Leachate",
            "description": "Decentralized collection has broken down. 40 metric tons of wet garbage is dumped in an open field near a school, attracting stray animals and polluting the water table.",
            "category": "Civic", "location": "Ward 12, Hazaribagh", "district": "Hazaribagh",
            "latitude": 23.9930, "longitude": 85.3620, "citizen_name": "Deepak Sinha", "is_anonymous": False,
            "priority": "Medium", "status": "Validated", "sla_hours": 12.0
        },
        {
            "id": "BP-2026-00429",
            "title": "High Fluoride Content in Deep Tube-Well Water Leading to Skeletal Fluorosis",
            "description": "School children in Leslieganj block are showing mottled yellow teeth and joint stiffness. Water tests show fluoride levels at 3.8 mg/L against the 1.0 safe limit.",
            "category": "Health", "location": "Leslieganj Block", "district": "Palamu",
            "latitude": 24.0300, "longitude": 84.2000, "citizen_name": "Dr. V. K. Dubey", "is_anonymous": False,
            "priority": "High", "status": "In Research", "sla_hours": 16.5
        },
        {
            "id": "BP-2026-00430",
            "title": "Lack of Vernacular Offline STEM Tools in Non-Electrified Schools",
            "description": "Government Middle School lacks regular power and internet. Students struggle to visualize science concepts because textbooks are in standard Hindi while mother tongue is Santhali/Ho.",
            "category": "Education", "location": "Ghatshila Sub-Division", "district": "East Singhbhum",
            "latitude": 22.5800, "longitude": 86.4800, "citizen_name": "Sunil Murmu", "is_anonymous": False,
            "priority": "Medium", "status": "Validated", "sla_hours": 28.0
        },
        {
            "id": "BP-2026-00431",
            "title": "Soil Compaction and Nutrient Depletion from Continuous Monoculture",
            "description": "Decades of excessive urea application on upland paddies have caused soil pH to drop below 5.0, resulting in stunted crop root growth and poor fertilizer uptake.",
            "category": "Agriculture", "location": "Chas Block", "district": "Bokaro",
            "latitude": 23.6300, "longitude": 86.1800, "citizen_name": "Anonymous Farmer", "is_anonymous": True,
            "priority": "Medium", "status": "Pending Validation", "sla_hours": 8.0
        },
        {
            "id": "BP-2026-00432",
            "title": "Frequent Flash Flooding and Embankment Erosion along Subarnarekha",
            "description": "Every monsoon, river bends erode 15-20 meters of fertile farmland and threaten mud houses in two adjacent tolas.",
            "category": "Environment", "location": "Chandil Riverside", "district": "Saraikela",
            "latitude": 22.9600, "longitude": 86.0500, "citizen_name": "Harish Mahato", "is_anonymous": False,
            "priority": "High", "status": "Pending Validation", "sla_hours": 6.5
        },
        {
            "id": "BP-2026-00433",
            "title": "Uncollected Plastic and Bio-Waste Clogging Drainage Outlets",
            "description": "Single-use plastics and packaging waste choke the primary storm drain, resulting in knee-deep waterlogging during 30 minutes of rain in main bazaar.",
            "category": "Civic", "location": "Main Road Market, Deoghar", "district": "Deoghar",
            "latitude": 24.4820, "longitude": 86.7000, "citizen_name": "Kishore Poddar", "is_anonymous": False,
            "priority": "Medium", "status": "Pending Validation", "sla_hours": 15.0
        },
        {
            "id": "BP-2026-00434",
            "title": "Mahua Flower Spoilage from Rain During Sun-Drying on Mud Floors",
            "description": "Gatherers lose up to 40% of their annual mahua crop to fungal mildew when pre-monsoon showers strike open air drying grounds.",
            "category": "Livelihood", "location": "Dumka Forest Range", "district": "Dumka",
            "latitude": 24.2600, "longitude": 87.2500, "citizen_name": "Parvati Hansda", "is_anonymous": False,
            "priority": "Medium", "status": "Pending Validation", "sla_hours": 4.0
        },
        {
            "id": "BP-2026-00435",
            "title": "Arsenic Contamination Detected in Shallow Handpumps along River Belt",
            "description": "Villagers report skin kerato-pigmentation on palms and feet. Initial spot testing shows arsenic concentration above 0.05 mg/L.",
            "category": "Health", "location": "Sahibganj River Basin", "district": "Sahibganj",
            "latitude": 25.2400, "longitude": 87.6500, "citizen_name": "Mukesh Mandal", "is_anonymous": False,
            "priority": "High", "status": "Pending Validation", "sla_hours": 11.2
        },
        {
            "id": "BP-2026-00436",
            "title": "Groundwater Table Plummeting by 4 Meters in Industrial Cluster",
            "description": "Uncontrolled borewell extraction by manufacturing units has dried up 25 village wells in 2 km radius. Immediate aquifer recharge needed.",
            "category": "Water", "location": "Tupudana Industrial Area", "district": "Ranchi",
            "latitude": 23.2900, "longitude": 85.3200, "citizen_name": "Santosh Lakra", "is_anonymous": False,
            "priority": "High", "status": "Validated", "sla_hours": 17.0
        },
        {
            "id": "BP-2026-00437",
            "title": "Lack of Low-Cost Soil Moisture Sensing for Rabi Mustard Cultivation",
            "description": "Small farmers over-irrigate or underwater mustard fields due to guesswork, leading to root rot or reduced seed oil content.",
            "category": "Agriculture", "location": "Simdega Central Plains", "district": "Simdega",
            "latitude": 22.6100, "longitude": 84.5000, "citizen_name": "Dharmendra Baitha", "is_anonymous": False,
            "priority": "Medium", "status": "Validated", "sla_hours": 20.0
        },
        {
            "id": "BP-2026-00438",
            "title": "Dangerous Blind Turns on Hilly Ghat Road Causing Accidents",
            "description": "Chutupalu valley road section has three blind curves with zero early warning sensors or parabolic mirrors, causing multiple truck-bus collisions.",
            "category": "Civic", "location": "Chutupalu Valley, Ramgarh", "district": "Ramgarh",
            "latitude": 23.5900, "longitude": 85.5100, "citizen_name": "Ramanand Tiwari", "is_anonymous": False,
            "priority": "High", "status": "Pending Validation", "sla_hours": 3.0
        },
        {
            "id": "BP-2026-00439",
            "title": "High Smoke Emission from Biomass Stoves Causing Respiratory Distress",
            "description": "Women and young children in tribal hamlets spend 4 hours daily cooking over wet fuelwood in unventilated mud kitchens, suffering chronic coughs.",
            "category": "Environment", "location": "Latehar Forest Margin", "district": "Latehar",
            "latitude": 23.7400, "longitude": 84.5000, "citizen_name": "Somra Oraon", "is_anonymous": False,
            "priority": "Medium", "status": "Validated", "sla_hours": 24.5
        },
        {
            "id": "BP-2026-00440",
            "title": "Pest Outbreak: Fall Armyworm Infesting Sweet Corn and Maize",
            "description": "Caterpillars boring into maize whorls across 120 acres. Farmers are using hazardous chemical cocktails without protective gear.",
            "category": "Agriculture", "location": "Godda Agri Belt", "district": "Godda",
            "latitude": 24.8300, "longitude": 87.2100, "citizen_name": "Pankaj Yadav", "is_anonymous": False,
            "priority": "High", "status": "Pending Validation", "sla_hours": 1.5
        },
        {
            "id": "BP-2026-00441",
            "title": "Dropouts in Secondary School Due to Distance and Safe Commute",
            "description": "Girls from three villages stop attending secondary school after class 8 because the nearest high school is 9 km away through forested terrain.",
            "category": "Education", "location": "Manoharpur Block, West Singhbhum", "district": "West Singhbhum",
            "latitude": 22.3800, "longitude": 85.2000, "citizen_name": "Shanti Gope", "is_anonymous": False,
            "priority": "High", "status": "Validated", "sla_hours": 18.0
        }
    ]

    prob_objs = {}
    for p in problems_data:
        deadline = now + datetime.timedelta(hours=48 - p["sla_hours"])
        created = now - datetime.timedelta(hours=p["sla_hours"])
        obj = models.Problem(
            id=p["id"], title=p["title"], description=p["description"],
            category=p["category"], location=p["location"], district=p["district"],
            latitude=p["latitude"], longitude=p["longitude"], citizen_name=p["citizen_name"],
            is_anonymous=p["is_anonymous"], priority=p["priority"], status=p["status"],
            sla_deadline=deadline, created_at=created, updated_at=now
        )
        db.add(obj)
        db.flush()
        prob_objs[p["id"]] = obj

        # AI Analysis object for each problem
        ai_obj = models.AIAnalysis(
            problem_id=p["id"],
            summary=f"Automated AI synthesis: {p['title']}. Location: {p['location']}.",
            domain=f"{p['category']} Systems & Applied Technology",
            extracted_keywords=f"{p['category']}, Rural Infrastructure, Community Resilience, Sustainable Deployment",
            duplicate_info="Verified against regional geo-spatial database (no duplicate cluster)" if p["id"] != "BP-2026-00421" else "2 similar water quality reports recorded in Angara Block",
            is_duplicate=False,
            priority_suggested=p["priority"],
            research_areas=f"{p['category']} Engineering, Environmental Management, Rural Applied Tech",
            is_live_ai=False,
            confidence_score=0.94
        )
        db.add(ai_obj)

        # District Validation for validated/active items
        if p["status"] not in ["Submitted", "Pending Validation"]:
            val_obj = models.DistrictValidation(
                problem_id=p["id"],
                officer_name="Shri A. K. Choudhary (District Planning Officer)",
                district=p["district"],
                action="Approved",
                notes="Field verification by BDO confirmed urgent community requirement. Approved for Higher Education research matching.",
                sla_hours_spent=p["sla_hours"]
            )
            db.add(val_obj)

    # 5. AI Expertise Matches for Validated Problems
    # Match the main demo case BP-2026-00421 to Dr. Ananya Sharma (BIT Mesra)
    ananya = next(r for r in res_objs if "Ananya" in r.name)
    neha = next(r for r in res_objs if "Neha" in r.name)
    soren = next(r for r in res_objs if "Soren" in r.name)
    kujur = next(r for r in res_objs if "Kujur" in r.name)
    sen = next(r for r in res_objs if "Sen" in r.name)
    priya = next(r for r in res_objs if "Priya" in r.name)
    meenakshi = next(r for r in res_objs if "Meenakshi" in r.name)

    matches_data = [
        {"prob": "BP-2026-00421", "res": ananya, "score": 94, "reason": "Research expertise in rural water purification and Chota Nagpur groundwater aquifer hydrology matches requirements exactly."},
        {"prob": "BP-2026-00421", "res": neha, "score": 88, "reason": "Extensive experience in village sand dam filtration and rural check-dam recharge."},
        {"prob": "BP-2026-00422", "res": soren, "score": 93, "reason": "Direct specialization in tribal region crop pathology, soil salinity, and bio-botanical fungicides."},
        {"prob": "BP-2026-00423", "res": kujur, "score": 96, "reason": "State clinical lead for point-of-care anemia screening in tribal women and infants."},
        {"prob": "BP-2026-00424", "res": ananya, "score": 87, "reason": "Telemetry and canal seepage acoustic flow sensor integration expertise."},
        {"prob": "BP-2026-00425", "res": sen, "score": 95, "reason": "Inventor of decentralized solar cold-storage units for perishables in off-grid rural areas."},
        {"prob": "BP-2026-00426", "res": priya, "score": 92, "reason": "Specialist in acid mine drainage remediation and bio-sorbent heavy metal filters."},
        {"prob": "BP-2026-00427", "res": meenakshi, "score": 91, "reason": "Authority on Tasar silk value chain ergonomics and solar-powered motorized spinning reels."}
    ]
    for m in matches_data:
        m_obj = models.ExpertiseMatch(
            problem_id=m["prob"], researcher_id=m["res"].id,
            match_score=m["score"], match_reason=m["reason"], status="Matched"
        )
        db.add(m_obj)

    # 6. Research Proposals (10+)
    # Include main demo proposal RPR-2026-0017
    proposals_data = [
        {
            "id": "RPR-2026-0017",
            "problem_id": "BP-2026-00421",
            "researcher_id": ananya.id,
            "title": "Solar-Powered Multi-Stage Aeration & Biosand Water Purification Unit",
            "problem_statement": "Deep borewell failure and acute iron/pathogen contamination in Siladon village water sources leading to daily distress travel and gastrointestinal illnesses.",
            "proposed_solution": "Deploy a decentralized solar PV-powered cascade aeration tower combined with slow sand-gravel bio-filtration and real-time IoT water quality sensors.",
            "methodology": "Phase 1: Hydrogeological aquifer survey; Phase 2: Fabrication of modular filtration prototype at BIT Mesra; Phase 3: Community installation and village water committee training.",
            "expected_outcome": "Clean potable water adhering to BIS 10500 standards (< 0.3 mg/L iron) delivering 4,000 liters/day to 1,200 villagers.",
            "timeline": 6, "budget": 480000, "resources": "Solar panels, filter media, Arduino LoRaWAN sensor node, water testing kits",
            "team": "Dr. Ananya Sharma (PI), Dr. Sanjay Karmakar (Co-PI), 2 M.Tech Scholars",
            "status": "In Execution"
        },
        {
            "id": "RPR-2026-0018",
            "problem_id": "BP-2026-00422",
            "researcher_id": soren.id,
            "title": "Indigenous Botanical Bio-Fungicide Formulation for Early Blight Suppression",
            "problem_statement": "Chemical fungicide resistance causing massive pre-harvest tomato rot in Bero block.",
            "proposed_solution": "Formulate emulsified botanical extracts from Pongamia pinnata and Neem cake combined with Trichoderma viride culture.",
            "methodology": "Field trials across 10 demo plots in Bero block with spectral imaging of leaf disease recovery index.",
            "expected_outcome": "75% reduction in early blight spread with zero chemical pesticide residues.",
            "timeline": 4, "budget": 240000, "resources": "Fermentation vat, sprayers, microscopic imaging setup",
            "team": "Dr. Rajeshwar Soren, 1 Agri Extension Specialist",
            "status": "Proposal Submitted"
        },
        {
            "id": "RPR-2026-0019",
            "problem_id": "BP-2026-00423",
            "researcher_id": kujur.id,
            "title": "Non-Invasive Optical Hemoglobinometer with Vernacular Mobile Triage for ANMs",
            "problem_statement": "Maternal anemia undetected in remote tribal villages due to absence of laboratory testing facilities.",
            "proposed_solution": "Low-cost non-invasive finger-sensor LED spectrophotometer connected via Bluetooth to a multilingual ANM tablet app.",
            "methodology": "Clinical calibration against gold-standard laboratory spectrophotometry followed by field deployment across 15 Sub-Health Centers.",
            "expected_outcome": "Instant 30-second anemia diagnosis with automatic alert to CHC for severe cases (< 7 g/dL).",
            "timeline": 5, "budget": 350000, "resources": "Optical sensor modules, 15 rugged tablets, calibration kits",
            "team": "Dr. Sunita Kujur (AIIMS), Dr. Ritu Sinha, 2 Biomedical Tech Assistants",
            "status": "Funded"
        },
        {
            "id": "RPR-2026-0020",
            "problem_id": "BP-2026-00424",
            "researcher_id": ananya.id,
            "title": "Acoustic Seepage Detection and LoRa Automated Sluice Gate Control",
            "problem_statement": "Severe canal water loss and tail-end crop drought in Ormanjhi agricultural corridor.",
            "proposed_solution": "Deploy battery-powered piezoelectric acoustic sensors along canal banks with low-power motorized sluice gates.",
            "methodology": "Sensor calibration along 8 km branch canal, solar powered telemetry transmitter, automated equitable dispatch.",
            "expected_outcome": "35% reduction in transmission water losses; 100% water security for tail-end fields.",
            "timeline": 6, "budget": 390000, "resources": "Acoustic hydrophones, LoRa gateways, solar actuators",
            "team": "BIT Mesra Water Resources Group",
            "status": "Funded"
        },
        {
            "id": "RPR-2026-0021",
            "problem_id": "BP-2026-00425",
            "researcher_id": sen.id,
            "title": "Decentralized Solar-Powered Evaporative Thermal Micro-Cold Storage for SHGs",
            "problem_statement": "Vegetable distress sales and spoilage causing acute economic loss to Patamda tribal growers.",
            "proposed_solution": "1.5 metric ton zero-grid cold room using solar thermal absorption chilling and charcoal cooling pads.",
            "methodology": "Fabrication of thermal insulation unit using locally available bamboo and polyurethane; field pilot at farmer market.",
            "expected_outcome": "Extends capsicum shelf-life from 3 days to 18 days at controlled 8-12°C, increasing farmer realization by 40%.",
            "timeline": 8, "budget": 650000, "resources": "Thermal absorption compressor, solar collectors, monitoring datalogger",
            "team": "Dr. Vikramaditya Sen, 3 NIT Jamshedpur Engineers",
            "status": "Funding Required"
        },
        {
            "id": "RPR-2026-0022",
            "problem_id": "BP-2026-00426",
            "researcher_id": priya.id,
            "title": "Constructed Wetland Bio-Reactor for Acid Mine Drainage Heavy Metal Neutralization",
            "problem_statement": "Acidic coal runoff polluting local water streams and groundwater in Jharia coal belt.",
            "proposed_solution": "Multi-tier limestone passive neutralizing channel integrated with vetiver grass and typha wetland beds.",
            "methodology": "Geochemical characterization, continuous pH/iron logging, bio-filtration column validation.",
            "expected_outcome": "Effluent pH neutralized from 4.2 to 7.2; 90% heavy metal biosorption.",
            "timeline": 9, "budget": 720000, "resources": "Limestone channel, water quality auto-samplers, spectrophotometer",
            "team": "IIT (ISM) Dhanbad Environmental Engineering",
            "status": "Proposal Submitted"
        },
        {
            "id": "RPR-2026-0023",
            "problem_id": "BP-2026-00427",
            "researcher_id": meenakshi.id,
            "title": "Ergonomic Solar-Powered Dual-Pedal Tasar Silk Reeling & Twisting Device",
            "problem_statement": "Physical strain and low output from thigh-reeling Tasar silk by rural artisans in Saraikela.",
            "proposed_solution": "Engineered low-cost solar motorized reeler with uniform tension control and safety guard.",
            "methodology": "Prototype development with rural artisans, ergonomic biomechanical assessment, field training workshops.",
            "expected_outcome": "300% increase in daily yarn production with zero thigh abrasion injuries; premium silk grading.",
            "timeline": 6, "budget": 320000, "resources": "BLDC motors, solar PV units, ergonomic seating frame",
            "team": "XISS Rural Innovation Cell & CSIR-NEIST",
            "status": "Funding Required"
        }
    ]
    prop_objs = {}
    for pr in proposals_data:
        obj = models.ResearchProposal(
            id=pr["id"], problem_id=pr["problem_id"], researcher_id=pr["researcher_id"],
            title=pr["title"], problem_statement=pr["problem_statement"],
            proposed_solution=pr["proposed_solution"], methodology=pr["methodology"],
            expected_outcome=pr["expected_outcome"], estimated_timeline_months=pr["timeline"],
            estimated_budget_inr=pr["budget"], required_resources=pr["resources"],
            research_team=pr["team"], status=pr["status"]
        )
        db.add(obj)
        db.flush()
        prop_objs[pr["id"]] = obj

    # 7. Funding Interests (8+)
    tata = next(c for c in csr_objs if "Tata" in c.name)
    ccl = next(c for c in csr_objs if "Coal India" in c.name)
    ntpc = next(c for c in csr_objs if "NTPC" in c.name)
    reliance = next(c for c in csr_objs if "Reliance" in c.name)
    infosys = next(c for c in csr_objs if "Infosys" in c.name)
    vedanta = next(c for c in csr_objs if "Vedanta" in c.name)

    funding_data = [
        {
            "prop": "RPR-2026-0017", "partner": tata, "amt": 500000, "type": "CSR Grant",
            "csr_align": "Water & Sanitation Mandate (Schedule VII Companies Act)",
            "why_match": "Tata Steel Foundation has an active rural drinking water security mandate in Angara block. This proposal provides a direct technological remedy for iron contamination.",
            "mentorship": True, "milestones": "Milestone 1: Hydrogeological survey; Milestone 2: Filter installation; Milestone 3: Water committee handover."
        },
        {
            "prop": "RPR-2026-0019", "partner": infosys, "amt": 350000, "type": "Research Grant",
            "csr_align": "Healthcare Tech for Vulnerable Communities",
            "why_match": "Infosys Foundation prioritizes digital healthcare diagnostic tools that empower frontline ASHA/ANM health workers in tribal belts.",
            "mentorship": True, "milestones": "Milestone 1: Device calibration; Milestone 2: 15 Health Center trial; Milestone 3: State Health Dept integration."
        },
        {
            "prop": "RPR-2026-0020", "partner": ccl, "amt": 400000, "type": "CSR Grant",
            "csr_align": "Rural Irrigation & Watershed Sustainability",
            "why_match": "Directly impacts farmer communities adjacent to Central Coalfields mining corridor with efficient water management.",
            "mentorship": False, "milestones": "Milestone 1: Sensor installation; Milestone 2: Gate automation pilot."
        },
        {
            "prop": "RPR-2026-0021", "partner": reliance, "amt": 650000, "type": "Pilot Sponsor",
            "csr_align": "Rural Livelihoods & Farmer Income Doubling",
            "why_match": "Reliance Foundation's rural transformation mandate actively funds decentralized cold storage to curb perishable food waste.",
            "mentorship": True, "milestones": "Milestone 1: Thermal chamber testing; Milestone 2: Field deployment at Mandi."
        },
        {
            "prop": "RPR-2026-0022", "partner": ccl, "amt": 720000, "type": "Environmental Remediation Grant",
            "csr_align": "Mine Water Treatment & Eco-Restoration",
            "why_match": "Directly satisfies statutory mine effluent rehabilitation guidelines in Dhanbad coal basin.",
            "mentorship": True, "milestones": "Milestone 1: Channel construction; Milestone 2: Water testing validation."
        },
        {
            "prop": "RPR-2026-0023", "partner": vedanta, "amt": 320000, "type": "Livelihood CSR Grant",
            "csr_align": "Women Tribal Empowerment & Artisanal Clusters",
            "why_match": "Aligned with Vedanta's project Nand Ghar and tribal women economic self-reliance initiatives in Jharkhand.",
            "mentorship": True, "milestones": "Milestone 1: Machine fabrication; Milestone 2: 50 weaver training."
        }
    ]
    for f in funding_data:
        f_obj = models.FundingInterest(
            proposal_id=f["prop"], partner_id=f["partner"].id,
            funding_amount_inr=f["amt"], funding_type=f["type"],
            csr_focus_alignment=f["csr_align"], why_match=f["why_match"],
            mentorship_offered=f["mentorship"], milestones=f["milestones"],
            status="Approved"
        )
        db.add(f_obj)

    # 8. Active Projects (5+)
    # Include main demo project PRJ-2026-003
    projects_data = [
        {
            "id": "PRJ-2026-003",
            "proposal_id": "RPR-2026-0017",
            "problem_id": "BP-2026-00421",
            "title": "Solar-Powered Community Water Filtration & Monitoring Station",
            "status": "Published",
            "location": "Siladon Village, Angara Block, Ranchi",
            "beneficiaries": 1250,
            "pilot_metrics": "Iron reduced from 3.6 mg/L to 0.18 mg/L; 4,200 Liters purified daily; zero downtime over 90 days."
        },
        {
            "id": "PRJ-2026-004",
            "proposal_id": "RPR-2026-0019",
            "problem_id": "BP-2026-00423",
            "title": "Field Pilot: Optical Hemoglobinometer for Tribal ANMs",
            "status": "Government Verified",
            "location": "Torpa Block, Khunti",
            "beneficiaries": 890,
            "pilot_metrics": "890 pregnant women screened; 142 severe anemia cases flagged and treated early; 98.4% clinical correlation with lab tests."
        },
        {
            "id": "PRJ-2026-005",
            "proposal_id": "RPR-2026-0020",
            "problem_id": "BP-2026-00424",
            "title": "Smart Canal Sluice & LoRa Acoustic Seepage Network",
            "status": "Deployed",
            "location": "Ormanjhi Irrigation Command Area",
            "beneficiaries": 2400,
            "pilot_metrics": "Acoustic sensors detected 4 major embankment leaks within 2 hours; saved an estimated 1.8 million liters."
        },
        {
            "id": "PRJ-2026-006",
            "proposal_id": "RPR-2026-0018",
            "problem_id": "BP-2026-00422",
            "title": "Botanical Bio-Fungicide Formulation Field Testing",
            "status": "In Research",
            "location": "Bero Block Demo Fields",
            "beneficiaries": 350,
            "pilot_metrics": "Batch-1 pilot completed across 10 acres; fungal sporulation suppressed by 68%."
        },
        {
            "id": "PRJ-2026-007",
            "proposal_id": "RPR-2026-0021",
            "problem_id": "BP-2026-00425",
            "title": "Micro-Thermal Solar Cold Storage Unit for Tribal Farmers",
            "status": "Field Pilot",
            "location": "Patamda Farmers Cooperative",
            "beneficiaries": 420,
            "pilot_metrics": "Chamber temperature held stable at 9.5°C during 41°C ambient summer peak without grid electricity."
        }
    ]
    for p in projects_data:
        p_obj = models.Project(
            id=p["id"], proposal_id=p["proposal_id"], problem_id=p["problem_id"],
            title=p["title"], status=p["status"], deployment_location=p["location"],
            beneficiaries_count=p["beneficiaries"], pilot_metrics=p["pilot_metrics"]
        )
        db.add(p_obj)

        # Add verification for verified/published projects
        if p["status"] in ["Government Verified", "Published"]:
            v_obj = models.ProjectVerification(
                project_id=p["id"],
                verifier_name="Dr. S. C. Murmu (State Innovation Council)",
                verifier_designation="Director of Technical Education & S&T",
                audit_findings="Comprehensive field inspection and independent water sample testing conducted. Meets all BIS standards and state innovation objectives.",
                is_verified=True
            )
            db.add(v_obj)

    # 9. Public Innovation Outcome Registry (5+)
    # Include main demo outcome OUT-2026-001
    outcomes_data = [
        {
            "id": "OUT-2026-001",
            "project_id": "PRJ-2026-003",
            "problem_id": "BP-2026-00421",
            "proposal_id": "RPR-2026-0017",
            "title": "Solar-Powered Drinking Water Purification & Real-Time Quality Monitoring System",
            "summary_solution": "Decentralized solar multi-stage aeration and biosand filtration unit delivering 4,000+ liters/day of clean, iron-free drinking water adhering to BIS 10500 standards.",
            "original_problem": "Recurring acute shortage of safe drinking water and heavy iron contamination forcing villagers to walk over 3 km.",
            "location": "Siladon Village, Angara Block, Ranchi District",
            "institution": "Birla Institute of Technology (BIT) Mesra",
            "team": "Dr. Ananya Sharma (Lead) & Water Engineering Lab",
            "industry": "Tata Steel Foundation (TSDS)",
            "impact": "1,250 citizens provided safe, iron-free potable drinking water daily with 0% gastrointestinal illnesses reported.",
            "citizen_name": "Raj Kumar",
            "is_anon": False
        },
        {
            "id": "OUT-2026-002",
            "project_id": "PRJ-2026-004",
            "problem_id": "BP-2026-00423",
            "proposal_id": "RPR-2026-0019",
            "title": "Portable Non-Invasive Hemoglobinometer for Rural ANM Maternal Care",
            "summary_solution": "Optical 30-second rapid finger sensor with multilingual vernacular tablet app eliminating painful needle pricks and lab travel for pregnant rural mothers.",
            "original_problem": "Lack of point-of-care anemia testing at remote Sub-Health Center resulting in undetected severe maternal complications.",
            "location": "Torpa Block, Khunti District",
            "institution": "AIIMS Deoghar Community Medicine Wing",
            "team": "Dr. Sunita Kujur & AIIMS Digital Health Group",
            "industry": "Infosys Foundation",
            "impact": "890 tribal pregnant mothers screened; 142 severe anemia cases detected and successfully treated.",
            "citizen_name": "Sushila Devi",
            "is_anon": False
        },
        {
            "id": "OUT-2026-003",
            "project_id": "PRJ-2026-005",
            "problem_id": "BP-2026-00424",
            "proposal_id": "RPR-2026-0020",
            "title": "LoRaWAN Acoustic Canal Seepage Detection & Automated Water Sluice",
            "summary_solution": "Acoustic hydrophone network embedded in canal embankments transmitting telemetry to solar actuated sluices to prevent breach flooding.",
            "original_problem": "Frequent canal seepage and unmonitored water wastage causing upstream flooding and tail-end farm drought.",
            "location": "Ormanjhi Irrigation Command Area, Ranchi",
            "institution": "Birla Institute of Technology (BIT) Mesra",
            "team": "Dr. Sanjay Karmakar & Hydrology Lab",
            "industry": "Coal India CSR / CCL",
            "impact": "Saved 1.8M liters of irrigation water and delivered equitable water to 2,400 farmers.",
            "citizen_name": "Arjun Oraon",
            "is_anon": False
        },
        {
            "id": "OUT-2026-004",
            "project_id": "PRJ-2026-003", # shared demo linkage
            "problem_id": "BP-2026-00426",
            "proposal_id": "RPR-2026-0022",
            "title": "Passive Constructed Wetland for Coal Mine Runoff Neutralization",
            "summary_solution": "Limestone cascaded diversion drains and bio-sorbent vetiver wetland beds neutralizing toxic acid mine drainage runoff.",
            "original_problem": "Acidic coal mine runoff turning community stream water acidic and polluting local drinking dugwells.",
            "location": "Bastacolla Mining Area, Dhanbad",
            "institution": "IIT (ISM) Dhanbad Environmental Science",
            "team": "Dr. Priya Mahato & Watershed Team",
            "industry": "Coal India CSR / CCL",
            "impact": "Water pH restored to healthy 7.2; heavy metal presence reduced by 91% for 3,100 residents.",
            "citizen_name": "Pooja Burnwal",
            "is_anon": False
        },
        {
            "id": "OUT-2026-005",
            "project_id": "PRJ-2026-007",
            "problem_id": "BP-2026-00425",
            "proposal_id": "RPR-2026-0021",
            "title": "Zero-Grid Evaporative Solar Micro-Cold Storage for Vegetable Cooperatives",
            "summary_solution": "Modular 1.5 metric ton solar thermal absorption cooling unit extending capsicum, tomato and chili shelf-life to 18 days.",
            "original_problem": "Post-harvest vegetable spoilage forcing tribal farmers into distress selling during summer months.",
            "location": "Patamda Vegetable Mandi, East Singhbhum",
            "institution": "NIT Jamshedpur Energy Systems",
            "team": "Dr. Vikramaditya Sen & Mechanical Dept",
            "industry": "Reliance Foundation",
            "impact": "Increased farmer net income by 40% across 420 smallholder grower households.",
            "citizen_name": "Bikash Soren",
            "is_anon": False
        }
    ]
    for o in outcomes_data:
        o_obj = models.PublicOutcome(
            id=o["id"], project_id=o["project_id"], problem_id=o["problem_id"],
            proposal_id=o["proposal_id"], title=o["title"],
            summary_solution=o["summary_solution"], original_problem_text=o["original_problem"],
            location=o["location"], research_institution=o["institution"],
            research_team=o["team"], industry_partner=o["industry"],
            impact_metric=o["impact"], citizen_contributor_name=o["citizen_name"],
            is_anonymous=o["is_anon"], is_published=True
        )
        db.add(o_obj)

    # 10. Notifications (5+)
    notifs_data = [
        {"title": "Problem BP-2026-00421 Validated", "message": "District Planning Officer approved 'Drinking Water Shortage in Rural Community' for research matching.", "type": "success", "role": "all", "related": "BP-2026-00421"},
        {"title": "Research Match Found", "message": "Dr. Ananya Sharma (BIT Mesra) matched with 94% relevance score to BP-2026-00421.", "type": "match", "role": "researcher", "related": "BP-2026-00421"},
        {"title": "Research Proposal RPR-2026-0017 Submitted", "message": "Solar-Powered Water Purification Proposal submitted for Industry/CSR discovery.", "type": "info", "role": "industry", "related": "RPR-2026-0017"},
        {"title": "CSR Funding Interest Recorded", "message": "Tata Steel Foundation offered INR 5,00,000 CSR Grant for proposal RPR-2026-0017.", "type": "success", "role": "researcher", "related": "RPR-2026-0017"},
        {"title": "Government Deployment Verified", "message": "State Innovation Review Board verified field trial of Project PRJ-2026-003 in Siladon village.", "type": "success", "role": "government", "related": "PRJ-2026-003"},
        {"title": "Public Outcome Published", "message": "Outcome OUT-2026-001 is now live in the Public Innovation Outcome Registry crediting Raj Kumar.", "type": "info", "role": "citizen", "related": "OUT-2026-001"}
    ]
    for n in notifs_data:
        n_obj = models.Notification(
            title=n["title"], message=n["message"], type=n["type"],
            target_role=n["role"], related_id=n["related"]
        )
        db.add(n_obj)

    # 11. Simulated Prototype Emails
    emails_data = [
        {
            "sender": "notifications@bharat-panchyt.gov.in",
            "recipient": "ananya.sharma@bitmesra.ac.in",
            "recipient_role": "Researcher",
            "subject": "Research Match Found: Drinking Water Shortage in Angara (BP-2026-00421)",
            "body": "Dear Dr. Ananya Sharma,\n\nA validated citizen problem matching your expertise in Hydrology & Rural Water Systems has entered the BHARAT-PANCHYT innovation pipeline.\n\nProblem ID: BP-2026-00421\nLocation: Siladon Village, Angara Block, Ranchi\nMatch Score: 94%\n\nPlease review the problem details and create a Research Proposal to connect with CSR funding.",
            "action_label": "Review Problem & Propose",
            "action_route": "/research-matching"
        },
        {
            "sender": "notifications@bharat-panchyt.gov.in",
            "recipient": "csr.water@tatasteel.com",
            "recipient_role": "Industry / CSR",
            "subject": "CSR Mandate Match: Solar Water Purification Proposal (RPR-2026-0017)",
            "body": "Dear Tata Steel Rural Development Society,\n\nA high-relevance research proposal matching your Water & Sanitation mandate has been submitted by BIT Mesra for Angara block.\n\nProposal ID: RPR-2026-0017\nEstimated Budget: INR 4,80,000\nTarget Beneficiaries: 1,200 villagers\n\nClick below to view proposal details and express funding interest.",
            "action_label": "View Proposal & Offer Funding",
            "action_route": "/funding-csr"
        },
        {
            "sender": "notifications@bharat-panchyt.gov.in",
            "recipient": "raj.kumar.siladon@demo-citizen.in",
            "recipient_role": "Citizen",
            "subject": "Update on Your Problem Submission BP-2026-00421",
            "body": "Namaste Raj Kumar Ji,\n\nWe are pleased to inform you that your report regarding 'Drinking Water Shortage in Siladon Village' has been successfully verified and connected with BIT Mesra researchers and Tata Steel Foundation funding.\n\nYour contribution has resulted in a verified Public Outcome: OUT-2026-001.\n\nThank you for empowering your community through BHARAT-PANCHYT!",
            "action_label": "View Public Outcome",
            "action_route": "/public-outcomes"
        }
    ]
    for e in emails_data:
        e_obj = models.SimulatedEmail(
            sender=e["sender"], recipient=e["recipient"], recipient_role=e["recipient_role"],
            subject=e["subject"], body=e["body"], action_label=e["action_label"],
            action_route=e["action_route"]
        )
        db.add(e_obj)

    db.commit()
    print("Database successfully seeded with realistic Indian research & civic datasets!")
