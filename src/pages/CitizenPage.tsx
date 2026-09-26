import React, { useState } from 'react';
import {
  FileText,
  Camera,
  Mic,
  MapPin,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  User,
  AlertCircle,
  Search,
  ArrowLeft,
  Filter
} from 'lucide-react';
import { Problem } from '../types';
import { api } from '../services/api';
import { StatusPill } from '../components/StatusPill';
import { HowItWorksCard } from '../components/HowItWorksCard';
import { CategoryHub } from '../components/CategoryHub';

interface CitizenPageProps {
  problems: Problem[];
  onProblemCreated: (newProblem: Problem) => void;
  onSelectProblem: (problem: Problem) => void;
}

const JHARKHAND_DISTRICTS = [
  'Ranchi', 'East Singhbhum', 'Dhanbad', 'Bokaro', 'Hazaribagh',
  'Deoghar', 'Dumka', 'Khunti', 'Ramgarh', 'Palamu', 'Saraikela',
  'Sahibganj', 'Simdega', 'Latehar', 'Godda', 'West Singhbhum'
];

export const CitizenPage: React.FC<CitizenPageProps> = ({
  problems,
  onProblemCreated,
  onSelectProblem
}) => {
  // Form State (NO MANUAL CATEGORY SELECTION - AI DETERMINES IT AUTOMATICALLY)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('Ranchi');
  const [citizenName, setCitizenName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Category Hub state for right column
  const [activeCategoryView, setActiveCategoryView] = useState<string | null>(null);

  // Submission Workflow Processing State (6 Steps)
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [detectedCategoryText, setDetectedCategoryText] = useState('AI Classifying...');
  const [submittedProblem, setSubmittedProblem] = useState<Problem | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  const PROCESSING_STEPS = [
    'STEP 1: Problem received from citizen',
    'STEP 2: AI analyzing problem semantics & intent',
    `STEP 3: ${detectedCategoryText}`,
    'STEP 4: Duplicate & cluster check against regional database',
    'STEP 5: Societal urgency priority assigned (High/Medium/Low)',
    'STEP 6: Dispatched to District Validation Officer (48h SLA)'
  ];

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasVoice(true);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      setErrorMessage('Please fill in Title, Description, and Village/Block Location.');
      return;
    }
    setErrorMessage('');
    setIsProcessing(true);
    setCurrentStep(1);

    // Dynamic AI step preview
    const timer1 = setTimeout(() => {
      setCurrentStep(2);
    }, 500);

    const timer2 = setTimeout(() => {
      setCurrentStep(3);
    }, 1100);

    const timer3 = setTimeout(() => {
      setCurrentStep(4);
    }, 1700);

    const timer4 = setTimeout(() => {
      setCurrentStep(5);
    }, 2300);

    try {
      const result = await api.createProblem({
        title,
        description,
        location,
        district,
        citizen_name: citizenName,
        is_anonymous: isAnonymous
      });

      setDetectedCategoryText(`Identified Domain: ${result.category} & Public Systems`);

      setTimeout(() => {
        setCurrentStep(6);
        setTimeout(() => {
          setIsProcessing(false);
          setSubmittedProblem(result);
          onProblemCreated(result);
          // Reset form fields
          setTitle('');
          setDescription('');
          setLocation('');
          setHasPhoto(false);
          setHasVoice(false);
        }, 800);
      }, 2900);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setIsProcessing(false);
      setErrorMessage('Submission error. Please retry.');
    }
  };

  // Filter problems for the right column
  let filteredProblems = problems;
  if (activeCategoryView && activeCategoryView !== 'All') {
    filteredProblems = filteredProblems.filter(p => p.category.toLowerCase() === activeCategoryView.toLowerCase());
  }
  if (searchTerm) {
    filteredProblems = filteredProblems.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-subtle text-teal uppercase tracking-wide">
            <Shield className="w-3.5 h-3.5" />
            No Account Required • Automatic AI Domain Classification
          </div>
          <h1 className="text-2xl font-bold text-navy-deep mt-1">
            Citizen Problem Submission Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Report your village or town problem in simple language (English, Hindi, or Hinglish). You don&apos;t need to choose a category—our AI engine automatically analyzes your concern and routes it to the right scientific domain.
          </p>
        </div>

        {/* Input Types Supported Badge Strip */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
            Inputs:
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white px-2 py-1 rounded shadow-xs border border-slate-200">
            <FileText className="w-3.5 h-3.5 text-teal" /> TEXT
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white px-2 py-1 rounded shadow-xs border border-slate-200">
            <Camera className="w-3.5 h-3.5 text-blue-600" /> PHOTO
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white px-2 py-1 rounded shadow-xs border border-slate-200">
            <Mic className="w-3.5 h-3.5 text-rose-600" /> VOICE
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white px-2 py-1 rounded shadow-xs border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> LOCATION
          </span>
        </div>
      </div>

      {/* How it Works Accordion */}
      <HowItWorksCard
        title="Automated Semantic Routing"
        steps={[
          "Citizens do NOT need to select technical categories—simply describe the problem naturally.",
          "Our AI Understanding Engine recognizes keywords in English, Hindi, and regional vernacular (e.g. 'pani', 'handpump', 'fasal', 'bimari', 'sadak').",
          "AI automatically assigns the scientific domain, calculates priority, and checks for duplicates.",
          "Optionally provide your name to receive permanent credit as 'Citizen Contributor' when the problem is solved."
        ]}
        whyItMatters="Removes technical friction for ordinary rural residents, allowing natural vernacular problem descriptions to guide academic research."
        defaultOpen={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form or 6-Step Processing */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card-gov p-6">
            <h2 className="text-base font-bold text-navy-deep border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <span>Report a Community Problem</span>
              <span className="text-[11px] font-semibold text-teal bg-teal-subtle px-2 py-0.5 rounded-full">
                AI Auto-Categorized
              </span>
            </h2>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* PROCESSING OVERLAY IF SUBMITTING */}
            {isProcessing ? (
              <div className="py-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-teal-subtle text-teal mx-auto flex items-center justify-center animate-spin">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-navy">AI Understanding Engine Processing</h3>
                  <p className="text-xs text-slate-500">Automatically classifying problem semantics into scientific domain</p>
                </div>

                <div className="space-y-2.5 max-w-md mx-auto">
                  {PROCESSING_STEPS.map((stepText, idx) => {
                    const stepNum = idx + 1;
                    const isDone = currentStep > stepNum;
                    const isCurrent = currentStep === stepNum;

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-3 transition-all ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : isCurrent
                            ? 'bg-navy text-white shadow-md ring-2 ring-saffron/60 font-semibold'
                            : 'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-white/20">
                          {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : stepNum}
                        </span>
                        <span>{stepText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : submittedProblem ? (
              /* POST-SUBMISSION SUCCESS CARD */
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Problem Received &amp; AI-Classified
                    </span>
                    <span className="font-mono text-xs font-extrabold bg-white px-2.5 py-0.5 rounded-md border border-emerald-300 text-emerald-900">
                      {submittedProblem.id}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-emerald-950">
                    {submittedProblem.title}
                  </h3>
                  <div className="text-xs text-emerald-800">
                    Auto-Classified Category: <strong>{submittedProblem.category}</strong>. Dispatched to District Validation Officer under 48h SLA.
                  </div>
                </div>

                {/* AI Analysis Summary Box */}
                {submittedProblem.ai_analysis && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal" />
                        AI Semantic Analysis
                      </span>
                      <StatusPill status={submittedProblem.priority} />
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-2.5 rounded border border-slate-200/80">
                      &ldquo;{submittedProblem.ai_analysis.summary}&rdquo;
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2 rounded border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Identified Domain</span>
                        <span className="font-medium text-navy">{submittedProblem.ai_analysis.domain}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Duplicate Check</span>
                        <span className="font-medium text-navy">{submittedProblem.ai_analysis.duplicate_info}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setSubmittedProblem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
                  >
                    Submit Another Problem
                  </button>
                  <button
                    onClick={() => onSelectProblem(submittedProblem)}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-light transition"
                  >
                    Inspect Problem Record
                  </button>
                </div>
              </div>
            ) : (
              /* CITIZEN SUBMISSION FORM */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1-Click Demo Fillers for Judges */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-navy">
                    <span className="flex items-center gap-1 text-teal">
                      <Sparkles className="w-3.5 h-3.5" />
                      1-Click Test Scenarios (English / Hindi / Hinglish):
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setTitle('चापाकल से लाल गंदा पानी आ रहा है और बच्चे बीमार पड़ रहे हैं');
                        setDescription('हमारे सिलादोन गांव में एकमात्र चापाकल से बहुत गंदा और आयरन वाला लाल पानी निकलता है। पीने से पेट खराब और उल्टी हो रही है। तुरंत वाटर फिल्टर चाहिए।');
                        setLocation('सिलादोन गांव, अनगड़ा प्रखंड');
                        setDistrict('Ranchi');
                        setCitizenName('राज कुमार मुंडा');
                        setIsAnonymous(false);
                        setHasPhoto(true);
                      }}
                      className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 text-[10px] font-semibold border border-sky-200 transition"
                    >
                      💧 Water (Hindi)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTitle('Tamatar ki fasal me kala daag aur keeda lag gaya hai');
                        setDescription('Bero block me 50 kisan bhaiyo ki tamatar aur aalu ki fasal par black fungus aur rog lag gaya hai. Mandi me bik nahi raha sab sadd raha hai.');
                        setLocation('Bero Block, Hatia Road');
                        setDistrict('Ranchi');
                        setCitizenName('Manoj Mahto');
                        setIsAnonymous(false);
                      }}
                      className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200 transition"
                    >
                      🌾 Agri (Hinglish)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTitle('Lack of portable maternal hemoglobin screening device at sub-center');
                        setDescription('Pregnant tribal mothers in remote Torpa hamlets have no hemoglobin test kits. Severe anemia remains undetected until high-risk emergency delivery.');
                        setLocation('Torpa Health Sub-Center');
                        setDistrict('Khunti');
                        setCitizenName('Sushila Devi (ASHA)');
                        setIsAnonymous(false);
                        setHasVoice(true);
                      }}
                      className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10px] font-semibold border border-rose-200 transition"
                    >
                      🏥 Health (English)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTitle('Tasar silk weavers suffering body strain in manual reeling');
                        setDescription('Women weavers in Saraikela spend 10 hours thigh-reeling cocoon silk. Physical abrasions and poor yarn consistency hurt rural livelihood income.');
                        setLocation('Saraikela Artisan Cluster');
                        setDistrict('Saraikela');
                        setCitizenName('Rani Hembram');
                        setIsAnonymous(false);
                      }}
                      className="px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 text-[10px] font-semibold border border-purple-200 transition"
                    >
                      🧵 Livelihood (Tasar Silk)
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siladon handpump yields red muddy water or Faslon me kida lag gaya hai"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                  <span className="text-[10px] text-teal font-medium mt-1 block">
                    AI will automatically detect the category (Water, Agriculture, Health, etc.) from your text!
                  </span>
                </div>

                {/* District Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District (Jharkhand) *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-teal focus:outline-none bg-white"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Problem Description &amp; Ground Situation *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the issue in your own words (Hindi / English / Hinglish). Mention how many people are affected and what problem is happening..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>

                {/* Village / Landmark Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Village / Block / Landmark Location *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siladon Village, Angara Block, near Primary Health Center"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-teal focus:outline-none"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Media Attachments Strip */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="border border-dashed border-slate-200 rounded-lg p-3 text-center bg-slate-50/50 hover:bg-slate-50 transition">
                    <button
                      type="button"
                      onClick={() => setHasPhoto(!hasPhoto)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-slate-700"
                    >
                      <Camera className={`w-4 h-4 ${hasPhoto ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{hasPhoto ? 'Photo Attached (1)' : 'Attach Photo'}</span>
                    </button>
                    {hasPhoto && (
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                        field_photo.jpg (Verified)
                      </span>
                    )}
                  </div>

                  <div className="border border-dashed border-slate-200 rounded-lg p-3 text-center bg-slate-50/50 hover:bg-slate-50 transition">
                    <button
                      type="button"
                      onClick={handleSimulateVoice}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-slate-700"
                    >
                      <Mic className={`w-4 h-4 ${isRecording ? 'text-rose-600 animate-pulse' : hasVoice ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{isRecording ? 'Recording (2s)...' : hasVoice ? 'Voice Note Attached' : 'Record Voice Note'}</span>
                    </button>
                    {hasVoice && (
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                        audio_message.wav (0:30)
                      </span>
                    )}
                  </div>
                </div>

                {/* Citizen Credit / Name Option */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal" />
                      Public Citizen Credit (Optional)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded text-teal focus:ring-teal"
                      />
                      <span>Report Anonymously</span>
                    </label>
                  </div>

                  {!isAnonymous && (
                    <input
                      type="text"
                      placeholder="Your Name (e.g. Raj Kumar) — credited on final Public Innovation Outcome Registry"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-teal focus:outline-none bg-white"
                    />
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-3 bg-teal hover:bg-teal-dark text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Problem &amp; Run AI Semantic Engine</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Category Hub FIRST, then drill-down to problems */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card-gov p-4 space-y-3">
            {!activeCategoryView ? (
              /* CATEGORY HUB VIEW */
              <div className="space-y-3">
                <CategoryHub
                  problems={problems}
                  onSelectCategory={(cat) => setActiveCategoryView(cat)}
                  badgeType="new"
                  title="Browse Problems by Category"
                  subtitle="Click any category to view problems. Badges show recently added reports."
                />
              </div>
            ) : (
              /* DRILL-DOWN PROBLEMS LIST FOR SELECTED CATEGORY */
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <button
                    onClick={() => setActiveCategoryView(null)}
                    className="flex items-center gap-1 text-xs font-bold text-teal hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Categories</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-navy bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {activeCategoryView}: {filteredProblems.length} Reports
                    </span>
                  </div>
                </div>

                {/* Search in Category */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search within ${activeCategoryView}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <div className="max-h-[560px] overflow-y-auto space-y-2.5 pr-1">
                  {filteredProblems.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No problems found in {activeCategoryView}.
                    </div>
                  ) : (
                    filteredProblems.map((prob) => (
                      <div
                        key={prob.id}
                        onClick={() => onSelectProblem(prob)}
                        className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-teal hover:shadow-xs transition cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-teal">
                            {prob.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <StatusPill status={prob.priority} />
                            <StatusPill status={prob.status} />
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-navy leading-snug line-clamp-1">
                          {prob.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {prob.description}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {prob.location}
                          </span>
                          <span>
                            {prob.citizen_name && !prob.is_anonymous ? `By ${prob.citizen_name}` : 'Anonymous'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
