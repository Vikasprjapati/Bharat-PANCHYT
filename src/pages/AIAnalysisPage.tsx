import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Send,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  FileText,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { HowItWorksCard } from '../components/HowItWorksCard';

const SAMPLE_PROMPTS = [
  {
    title: 'Drinking Water Shortage & Iron Contamination',
    category: 'Water',
    location: 'Siladon Village, Angara Block, Ranchi',
    desc: 'Residents in Siladon village are travelling over 3 km every morning to fetch stream water because borewells dried up and the single operational handpump yields brownish, high-iron water causing stomach illness.'
  },
  {
    title: 'Siladon gaon ke handpump se laal ganda paani (Hinglish/Hindi)',
    category: 'Water',
    location: 'Siladon Gaon, Angara Block, Ranchi',
    desc: 'Siladon gaon me chaapa kal aur borewell se bohot ganda aur laal mitti wala pani nikal raha hai. Peene se pet kharab aur bimari ho rahi hai, peene ke saaf paani ki bohot kami hai.'
  },
  {
    title: 'Tamatar fasal me kala kida aur fungus (Hinglish/Hindi)',
    category: 'Agriculture',
    location: 'Bero Block, Ranchi District',
    desc: 'Bero block me kisan pareshan hain, tamatar ki khadi fasal me kala kida aur patton me fungus lag gaya hai. Mandi me bechne se pehle sari sabji kharab ho rahi hai aur khad dawai kaam nahi kar rahi.'
  },
  {
    title: 'Up-swasthya kendra me hemoglobin machine kharab (Hinglish/Hindi)',
    category: 'Health',
    location: 'Torpa Block, Khunti District',
    desc: 'Up-kendra me doctor aur nurse ke paas khoon ki kami (anemia) jaanch karne ki machine nahi hai. Garbhvati mahilaon ko test ke liye 28 km dur aspatal jana padta hai.'
  },
  {
    title: 'Sadak me bade gaddhe aur bijli gul (Hinglish/Hindi)',
    category: 'Civic',
    location: 'Kanke Road, Ranchi',
    desc: 'Kanke main sadak par bade gaddhe hain aur street light kharab hai. Nali ka ganda kachra raste par beh raha hai aur raat ko aksar accident ho rahe hain.'
  },
  {
    title: 'Toxic Acid Mine Drainage Runoff Polluting Streams',
    category: 'Environment',
    location: 'Bastacolla Area, Jharia, Dhanbad',
    desc: 'Runoff from open cast coal dumps is turning the Jharia nullah acidic (pH < 4.5), killing cattle fish and making groundwater in nearby dugwells undrinkable.'
  }
];

export const AIAnalysisPage: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_PROMPTS[0]);
  const [title, setTitle] = useState(SAMPLE_PROMPTS[0].title);
  const [category, setCategory] = useState(SAMPLE_PROMPTS[0].category);
  const [location, setLocation] = useState(SAMPLE_PROMPTS[0].location);
  const [description, setDescription] = useState(SAMPLE_PROMPTS[0].desc);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSelectSample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setSelectedSample(sample);
    setTitle(sample.title);
    setCategory(sample.category);
    setLocation(sample.location);
    setDescription(sample.desc);
    setResult(null);
  };

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    try {
      const data = await api.analyzeAI({
        title,
        description,
        category,
        location
      });
      setResult(data);
    } catch (err) {
      alert('AI processing encountered a network issue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-subtle text-teal uppercase tracking-wide">
            <Brain className="w-3.5 h-3.5" />
            AI Understanding &amp; Heuristic Engine
          </div>
          <h1 className="text-2xl font-bold text-navy-deep mt-1">
            AI Semantic Processing Sandbox
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test how citizen text submissions are transformed into structured technical domains, priority levels, duplicate flags, and research expertise keywords.
          </p>
        </div>

        <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-saffron" />
          <span>Dual Mode: Google Gemini API with Deterministic Mock Fallback</span>
        </div>
      </div>

      {/* How it Works Accordion */}
      <HowItWorksCard
        title="AI Problem Classification Pipeline"
        steps={[
          "Receives unstructured, vernacular-rich citizen complaint text and parses key distress indicators.",
          "Maps the complaint into formal scientific disciplines (e.g. 'Hydrology & Water Engineering' or 'Community Medicine').",
          "Executes geo-spatial and semantic similarity searches against existing database records to spot duplicate clusters.",
          "Calculates societal priority (High/Medium/Low) based on health risk and population scale."
        ]}
        whyItMatters="Transforms subjective, unstructured complaints into structured scientific briefs that researchers and funding committees can immediately evaluate."
        defaultOpen={true}
      />

      {/* Sample Selectors */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Load Pre-Configured Test Scenarios:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                selectedSample.title === sample.title
                  ? 'border-teal bg-teal-subtle/40 ring-1 ring-teal text-navy font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] text-teal block uppercase font-bold">{sample.category}</span>
              <span className="line-clamp-1">{sample.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sandbox Grid: Inputs & Live AI Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card-gov p-5 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Input Citizen Problem Parameters</span>
              <span className="text-slate-400 font-normal">Editable</span>
            </h3>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none"
              />
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-teal hover:bg-teal-dark text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Brain className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Running AI Semantic Pipeline...' : 'Execute AI Understanding Pipeline'}</span>
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card-gov p-5 space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal" />
                AI Understanding Engine Output
              </h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                {result?.is_live_ai ? 'Live Gemini 1.5' : 'Demo AI Analysis'}
              </span>
            </div>

            {result ? (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* AI Summary */}
                <div className="p-3 bg-teal-subtle/40 rounded-xl border border-teal/20 space-y-1">
                  <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">
                    Synthesized Problem Summary
                  </span>
                  <p className="text-xs text-navy-deep leading-relaxed italic font-medium">
                    &ldquo;{result.summary}&rdquo;
                  </p>
                </div>

                {/* Priority & Domain Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Technical Domain</span>
                    <span className="font-bold text-navy">{result.domain}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Suggested Priority</span>
                    <span className="font-bold text-rose-600">{result.priority_suggested}</span>
                  </div>
                </div>

                {/* Keywords & Academic Disciplines */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      Extracted Technical Keywords
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.extracted_keywords.split(',').map((kw: string, idx: number) => (
                        <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700">
                          {kw.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      Recommended Academic Disciplines
                    </span>
                    <span className="font-medium text-navy">{result.research_areas}</span>
                  </div>
                </div>

                {/* Duplicate Check Info */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Regional Duplicate Check</span>
                    <span className="text-slate-700 font-medium">{result.duplicate_info}</span>
                  </div>
                  <span className="text-teal font-bold font-mono">
                    Score: {(result.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs space-y-2">
                <Brain className="w-8 h-8 mx-auto text-slate-300" />
                <p>Click &ldquo;Execute AI Understanding Pipeline&rdquo; to process this problem scenario.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
