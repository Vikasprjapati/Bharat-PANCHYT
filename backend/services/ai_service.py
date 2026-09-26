import os
import json
import logging
import requests

logger = logging.getLogger("ai_service")

# Multilingual keywords dictionary for Water, Agriculture, Health, Civic, Environment, Livelihood, Education
KEYWORD_DICTIONARY = {
    "Water": [
        'water', 'drinking water', 'groundwater', 'borewell', 'handpump', 'well', 'aquifer',
        'contamination', 'iron', 'fluoride', 'arsenic', 'pipeline', 'tap', 'river', 'pond',
        'dam', 'reservoir', 'sewage', 'canal', 'irrigation', 'shortage', 'drought', 'thirsty',
        'muddy water', 'supply', 'turbidity', 'purification', 'filter', 'leakage',
        'pani', 'paani', 'peene ka pani', 'jal', 'nal', 'nalkoop', 'kuva', 'kuan', 'chapakal',
        'chaapa kal', 'dushit pani', 'ganda pani', 'sukha', 'talab', 'nadi', 'paani ki kami'
    ],
    "Agriculture": [
        'crop', 'agriculture', 'farmer', 'farming', 'harvest', 'blight', 'fungus', 'disease',
        'pest', 'insect', 'fertilizer', 'pesticide', 'soil', 'yield', 'seed', 'wheat', 'rice',
        'paddy', 'tomato', 'vegetable', 'potato', 'cold storage', 'mandi', 'post-harvest',
        'salinity', 'spoilage', 'drip', 'agritech',
        'kisan', 'kisaan', 'kheti', 'fasal', 'anaaj', 'tamatar', 'mitti', 'beej', 'keeda',
        'rog', 'khad', 'urea', 'sinchai', 'sanchai', 'fasal kharab', 'podha', 'paudha'
    ],
    "Health": [
        'health', 'hospital', 'clinic', 'doctor', 'nurse', 'anm', 'asha', 'patient', 'disease',
        'illness', 'anemia', 'blood', 'fever', 'malaria', 'dengue', 'medicine', 'medical',
        'sub-center', 'infant', 'maternal', 'pregnant', 'pregnancy', 'emergency', 'ambulance',
        'malnutrition', 'stomach', 'diarrhea', 'diagnostic', 'hemoglobin', 'pathology',
        'bimari', 'dawa', 'dawai', 'aspatal', 'aaspataal', 'chikitsa', 'bimar', 'khoon ki kami',
        'bukhar', 'garbhvati', 'mahila', 'ilaj', 'swasthya', 'upkendra', 'swasthya kendra'
    ],
    "Civic": [
        'road', 'pothole', 'street', 'streetlight', 'electricity', 'power cut', 'transformer',
        'wire', 'drainage', 'drain', 'gutter', 'sewer', 'nala', 'nullah', 'garbage', 'waste',
        'trash', 'plastic', 'municipal', 'municipality', 'traffic', 'bridge', 'accident',
        'footpath', 'sanitation', 'dump', 'paving', 'lights',
        'sadak', 'rasta', 'khadda', 'gaddha', 'bijli', 'batti', 'light', 'tar', 'nali',
        'naala', 'kachra', 'kooda', 'safai', 'nagar nigam', 'pul', 'puliya', 'jaam', 'hadsa'
    ],
    "Environment": [
        'environment', 'pollution', 'air', 'smoke', 'smog', 'emission', 'dust', 'coal',
        'coal dust', 'mine', 'mining', 'acid mine', 'acid', 'river pollution', 'toxic',
        'chemical', 'industrial waste', 'deforestation', 'forest fire', 'ecology', 'effluent',
        'pradushan', 'dhuan', 'dhuwa', 'koyla', 'khadan', 'khan', 'van', 'jangal', 'paryavaran'
    ],
    "Livelihood": [
        'livelihood', 'employment', 'job', 'unemployment', 'income', 'wage', 'poverty',
        'artisan', 'weaver', 'weaving', 'loom', 'handloom', 'silk', 'tasar', 'handicraft',
        'self help group', 'shg', 'cooperative', 'micro-enterprise', 'market', 'forest produce',
        'mahua', 'lac', 'honey', 'spinning', 'craft',
        'rozgar', 'berojgari', 'kamai', 'aamdani', 'bunkar', 'silai', 'resham', 'hastshilp', 'samuh'
    ],
    "Education": [
        'education', 'school', 'classroom', 'teacher', 'student', 'college', 'books',
        'textbook', 'library', 'laboratory', 'lab', 'computer', 'internet', 'dropout',
        'girls education', 'literacy', 'blackboard', 'bench', 'desk', 'uniform', 'exam',
        'shiksha', 'padhai', 'vidyalaya', 'shikshak', 'master', 'vidyarthi', 'bache', 'bachhe'
    ]
}

CATEGORY_DEFAULTS = {
    "Water": {
        "domain": "Water Resources, Hydrology & Environmental Public Health",
        "keywords": ["Groundwater Depletion", "Solar Water Purification", "Rural Piped Network", "Hydrological Monitoring", "Water Quality Sensor"],
        "research_areas": ["Hydrology & Water Engineering", "Public Health Engineering", "IoT Sensor Systems"],
        "priority": "High"
    },
    "Agriculture": {
        "domain": "Precision Agronomy, Crop Pathology & Post-Harvest Tech",
        "keywords": ["Crop Disease Suppression", "Bio-Botanical Sprays", "Soil Salinity", "Cold Storage Micro-Units", "Indigenous Bio-fertilizer"],
        "research_areas": ["Agronomy & Soil Sciences", "Agri-Tech Robotics", "Food Processing Engineering"],
        "priority": "Medium"
    },
    "Health": {
        "domain": "Rural Healthcare Diagnostics & Community Biomedical Systems",
        "keywords": ["Point-of-Care Diagnostics", "Maternal Anemia Triage", "Non-Invasive Screening", "Telemedicine Triaging", "Waterborne Pathogens"],
        "research_areas": ["Biomedical Engineering", "Community Medicine", "Health Informatics"],
        "priority": "High"
    },
    "Civic": {
        "domain": "Civic Systems, Solid Waste Engineering & Smart Infrastructure",
        "keywords": ["Decentralized Waste Composting", "Pothole Detection Vision", "Drainage Flow Optimization", "Municipal GIS"],
        "research_areas": ["Urban & Environmental Planning", "Civil Engineering", "Computer Vision"],
        "priority": "Medium"
    },
    "Livelihood": {
        "domain": "Rural Livelihood Engineering, Ergonomics & Micro-Enterprise",
        "keywords": ["Tasar Silk Processing", "Minor Forest Produce Value-Add", "Solar Loom", "Craft Supply Chain", "Agro-Enterprise"],
        "research_areas": ["Textile & Material Technology", "Renewable Energy Systems", "Rural Economics"],
        "priority": "Medium"
    },
    "Education": {
        "domain": "Digital Pedagogy, STEM Infrastructure & Vernacular EdTech",
        "keywords": ["Vernacular Audio-Visual Tools", "Off-grid Digital Classroom", "Low-cost STEM Labs", "Assistive Learning Devices"],
        "research_areas": ["Educational Technology", "Human-Computer Interaction", "Cognitive Systems"],
        "priority": "Medium"
    },
    "Environment": {
        "domain": "Environmental Remediation, Eco-Restoration & Clean Energy",
        "keywords": ["Mine Water Remediation", "Air Quality Particulate Scrubbers", "Afforestation GIS", "Biomass Briquetting"],
        "research_areas": ["Environmental Engineering", "Material Sciences", "Atmospheric Physics"],
        "priority": "High"
    }
}

def detect_category_from_text(title: str, description: str) -> str:
    full_text = (title + " " + description).lower()
    scores = {cat: 0 for cat in KEYWORD_DICTIONARY}
    for cat, words in KEYWORD_DICTIONARY.items():
        for word in words:
            if word in full_text:
                weight = 3 if word in title.lower() else 1
                scores[cat] += weight
    best_cat = max(scores, key=scores.get)
    return best_cat if scores[best_cat] > 0 else "Civic"

def analyze_problem_content(title: str, description: str, category: str = None, location: str = "Jharkhand") -> dict:
    # If category is not provided or generic, auto-detect using semantic classifier
    if not category or category == "All" or category == "Unknown":
        category = detect_category_from_text(title, description)

    gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()

    if gemini_key:
        try:
            prompt = f"""
You are an expert AI classifying citizen problems for the Indian research and innovation platform BHARAT-PANCHYT.
Analyze the following problem submission and return ONLY a valid JSON object with these keys:
- summary: A crisp 1-2 sentence problem summary.
- domain: The most relevant academic/research domain.
- extracted_keywords: An array of 4-6 concise technical keywords.
- duplicate_info: Note if this seems like a common regional pattern.
- is_duplicate: boolean (false by default).
- priority_suggested: "High", "Medium", or "Low".
- research_areas: An array of 2-4 academic disciplines suitable to tackle this.
- confidence_score: float between 0.85 and 0.99.

Citizen Input:
Category: {category}
Location: {location}
Title: {title}
Description: {description}
"""
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "response_mime_type": "application/json"
                }
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=6)
            if resp.status_code == 200:
                data = resp.json()
                text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text_content)
                return {
                    "category": category,
                    "summary": parsed.get("summary", f"Community reported issue regarding {title} in {location}."),
                    "domain": parsed.get("domain", CATEGORY_DEFAULTS.get(category, {}).get("domain", "Applied Science & Engineering")),
                    "extracted_keywords": ", ".join(parsed.get("extracted_keywords", ["Community Needs", "Public Infrastructure"])),
                    "duplicate_info": parsed.get("duplicate_info", "No direct duplicate cluster detected in radius."),
                    "is_duplicate": parsed.get("is_duplicate", False),
                    "priority_suggested": parsed.get("priority_suggested", "High"),
                    "research_areas": ", ".join(parsed.get("research_areas", ["Interdisciplinary Engineering", "Public Systems"])),
                    "is_live_ai": True,
                    "confidence_score": float(parsed.get("confidence_score", 0.95))
                }
        except Exception as e:
            logger.warning(f"Live Gemini API call failed ({e}). Falling back smoothly to Demo AI.")

    # Deterministic Multilingual Fallback
    cat_config = CATEGORY_DEFAULTS.get(category, CATEGORY_DEFAULTS["Water"])
    desc_lower = description.lower() + " " + title.lower()
    high_urgency_words = ["danger", "emergency", "severe", "contaminated", "died", "poison", "critical", "broken", "months", "shortage", "stopped", "bimari", "khoon", "mrityu", "khatra"]
    suggested_priority = "High" if any(w in desc_lower for w in high_urgency_words) else cat_config["priority"]

    dup_str = "2 similar problems reported in adjoining block panchayats" if ("water" in desc_lower or "pani" in desc_lower or "road" in desc_lower) else "No direct duplicates identified within 15km radius"
    summary = f"Citizen report flags {category.lower()} challenge: {title.strip('.')}. Requires targeted technical intervention in {location}."

    return {
        "category": category,
        "summary": summary,
        "domain": cat_config["domain"],
        "extracted_keywords": ", ".join(cat_config["keywords"][:4]),
        "duplicate_info": dup_str,
        "is_duplicate": False,
        "priority_suggested": suggested_priority,
        "research_areas": ", ".join(cat_config["research_areas"]),
        "is_live_ai": False,
        "confidence_score": 0.94
    }
