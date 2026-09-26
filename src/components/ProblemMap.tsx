import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Problem } from '../types';
import { StatusPill } from './StatusPill';
import { MapPin, ExternalLink, Filter } from 'lucide-react';

interface ProblemMapProps {
  problems: Problem[];
  onSelectProblem?: (problem: Problem) => void;
}

// Custom Category SVG Marker Icons
const createCustomIcon = (category: string, priority: string) => {
  let color = '#087F73'; // Teal default
  if (category === 'Water') color = '#0284C7';
  if (category === 'Agriculture') color = '#159A6B';
  if (category === 'Health') color = '#DC2626';
  if (category === 'Environment') color = '#059669';
  if (category === 'Civic') color = '#D97706';
  if (category === 'Livelihood') color = '#9333EA';
  if (category === 'Education') color = '#4F46E5';

  const pulse = priority === 'High' ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>' : '';

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-md bg-white border-2" style="border-color: ${color}">
      <div class="w-3.5 h-3.5 rounded-full" style="background-color: ${color}"></div>
      ${pulse}
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-map-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export const ProblemMap: React.FC<ProblemMapProps> = ({ problems, onSelectProblem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const center: [number, number] = [23.6102, 85.2799]; // Jharkhand Center

  const categories = ['All', 'Water', 'Agriculture', 'Health', 'Civic', 'Environment', 'Livelihood', 'Education'];

  // Count by category
  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return problems.length;
    return problems.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
  };

  const filtered = problems.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const highPriorityCount = problems.filter(p => p.priority === 'High').length;
  const uniqueDistricts = new Set(problems.map(p => p.district)).size;

  return (
    <div className="card-gov p-4 sm:p-5 space-y-4">
      {/* Header with Title and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-navy-deep flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal" />
            Geographic Innovation Need Map (State of Jharkhand)
          </h3>
          <p className="text-xs text-slate-500">
            Real-world community issues geolocated across district administrative blocks and panchayats
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold">
            {problems.length} Problems
          </span>
          <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            {highPriorityCount} High Priority
          </span>
          <span className="px-2.5 py-1 bg-teal-subtle text-teal rounded-lg font-semibold">
            {uniqueDistricts} Districts
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Category Filter Pills with counts */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {categories.map(cat => {
            const count = getCategoryCount(cat);
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-navy text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input inside map */}
        <div className="w-full lg:w-64">
          <input
            type="text"
            placeholder="Search village, district, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
          />
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="h-[480px] rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0 relative">
        <MapContainer
          center={center}
          zoom={8}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((prob) => {
            const lat = prob.latitude || 23.3441;
            const lng = prob.longitude || 85.3096;
            return (
              <Marker
                key={prob.id}
                position={[lat, lng]}
                icon={createCustomIcon(prob.category, prob.priority)}
              >
                <Popup>
                  <div className="p-1 space-y-2 min-w-[240px] max-w-[280px]">
                    <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-teal">{prob.id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
                          {prob.category}
                        </span>
                      </div>
                      <StatusPill status={prob.priority} />
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-navy leading-snug">
                        {prob.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {prob.description}
                      </p>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {prob.location} ({prob.district})
                      </span>
                      <StatusPill status={prob.status} />
                    </div>

                    {onSelectProblem && (
                      <button
                        onClick={() => onSelectProblem(prob)}
                        className="w-full mt-1.5 py-1.5 bg-teal hover:bg-teal-dark text-white text-xs rounded-lg font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                      >
                        <span>Inspect Problem Record</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend & Attribution */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span> High Priority (Pulsing)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"></span> Water
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Agriculture
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Health
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span> Civic
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span> Livelihood
          </span>
        </div>
        <span className="font-medium text-slate-400">
          Showing {filtered.length} of {problems.length} geolocated pins
        </span>
      </div>
    </div>
  );
};
