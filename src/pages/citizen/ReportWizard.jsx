import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ImageUploader } from '../../components/common/ImageUploader';
import { Toast } from '../../components/common/Toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Trash2, HardHat, Lightbulb, Droplet, CloudRain, Zap, Waves, Activity, Trees, AlertTriangle,
  Check, ArrowRight, ArrowLeft, MapPin, ClipboardCheck, ThumbsUp, Calendar
} from 'lucide-react';

const categories = [
  { name: 'Garbage & Waste', icon: Trash2 },
  { name: 'Road & Potholes', icon: HardHat },
  { name: 'Streetlight Failures', icon: Lightbulb },
  { name: 'Water Supply Disruptions', icon: Droplet },
  { name: 'Drainage & Flooding', icon: CloudRain },
  { name: 'Electricity Failures', icon: Zap },
  { name: 'Flood Alerts', icon: Waves },
  { name: 'Sewage & Sanitation', icon: Activity },
  { name: 'Parks & Public Spaces', icon: Trees },
  { name: 'General Safety Hazards', icon: AlertTriangle }
];

// Helper to render Leaflet map clicks to update marker
const MapEventsHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

const bluePinIcon = L.divIcon({
  html: `<span class="relative flex h-6 w-6">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
    <span class="relative inline-flex rounded-full h-6 w-6 bg-brand-blue border-2 border-white shadow-lg"></span>
  </span>`,
  className: 'custom-pin-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export const ReportWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createIssue } = useIssues();

  // Wizard state persisted across steps
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('cityfix_draft_report');
    return saved ? JSON.parse(saved) : {
      category: '',
      title: '',
      description: '',
      images: [],
      latitude: 6.9271, // Colombo default
      longitude: 79.8612,
      ticketId: ''
    };
  });

  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync draft to local storage
  useEffect(() => {
    localStorage.setItem('cityfix_draft_report', JSON.stringify(formData));
  }, [formData]);

  // Determine current step index based on pathname
  const pathParts = location.pathname.split('/');
  const activeStepStr = pathParts[pathParts.length - 1]; // category, details, location, review, success

  const stepsList = ['category', 'details', 'location', 'review', 'success'];
  const currentStepIndex = stepsList.indexOf(activeStepStr);

  const setStep = (stepName) => {
    navigate(`/citizen/report/${stepName}`);
  };

  const handleCategorySelect = (catName) => {
    setFormData(prev => ({ ...prev, category: catName }));
    setTimeout(() => setStep('details'), 250);
  };

  const handleDetailsSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.category) {
      setToastType('error');
      setToastMsg('Please select a category first.');
      setStep('category');
      return;
    }
    if (!formData.title.trim()) {
      setToastType('error');
      setToastMsg('Issue Title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setToastType('error');
      setToastMsg('Issue Description is required.');
      return;
    }
    setStep('location');
  };

  const handleLocationSubmit = () => {
    setStep('review');
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const issue = await createIssue(formData);
      setFormData(prev => ({ ...prev, ticketId: issue.ticketId }));
      
      // Clear draft storage
      localStorage.removeItem('cityfix_draft_report');

      setStep('success');
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    // Simulating GPS coordinates around Galle Face/Colombo Port
    const lat = 6.9322 + (Math.random() - 0.5) * 0.005;
    const lng = 79.8471 + (Math.random() - 0.5) * 0.005;
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    setToastType('success');
    setToastMsg('Simulated GPS coordinates retrieved successfully!');
  };

  const handleMapClick = (lat, lng) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}

      {/* Progress header */}
      {activeStepStr !== 'success' && (
        <div className="glass-card rounded-2xl p-5 shadow flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Report Wizard Progress</span>
            <span className="uppercase">Step {currentStepIndex + 1} of 4: {activeStepStr}</span>
          </div>
          <ProgressBar value={currentStepIndex} max={3} color="brand" />
        </div>
      )}

      {/* Step Components Outlet */}

      {/* 1. CATEGORY STEP */}
      {activeStepStr === 'category' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Select Category</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Select the type of urban issue you are experiencing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.name;
              return (
                <div
                  key={idx}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 border-brand-blue shadow-glow-blue scale-[1.01]'
                      : 'glass-card border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-brand-blue text-white' : 'bg-slate-100 dark:bg-slate-950 text-slate-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {cat.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. DETAILS STEP */}
      {activeStepStr === 'details' && (
        <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Provide Incident Details</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Please describe the hazard. Add photos to help dispatcher validation.</p>
          </div>

          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
            <Input
              label="Issue Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value.substring(0, 100) }))}
              placeholder="e.g. Broken drainage cover at the school junction"
              maxLength={100}
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value.substring(0, 500) }))}
              placeholder="Provide exact details of the damage, how long it has been present, and potential hazards to pedestrian/vehicle safety."
              charCount={formData.description.length}
              maxChars={500}
              required
            />

            <ImageUploader
              onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <Button variant="secondary" onClick={() => setStep('category')} icon={ArrowLeft}>
              Back
            </Button>
            <Button type="submit" variant="primary" icon={ArrowRight}>
              Next: Location
            </Button>
          </div>
        </form>
      )}

      {/* 3. LOCATION STEP */}
      {activeStepStr === 'location' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Pinpoint Location</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Click on the map to set the exact coordinates of the issue.</p>
          </div>

          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
            {/* Map wrapper */}
            <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-inner relative">
              <MapContainer 
                key={[formData.latitude, formData.longitude].join(',')}
                center={[formData.latitude, formData.longitude]} 
                zoom={14} 
                className="w-full h-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[formData.latitude, formData.longitude]} icon={bluePinIcon} />
                <MapEventsHandler onMapClick={handleMapClick} />
              </MapContainer>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-100/40 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/20 dark:border-slate-800/20">
              <div className="flex flex-col text-xs font-semibold text-slate-500 dark:text-slate-400 gap-0.5">
                <span>Selected Coordinates:</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-200">
                  Lat: {formData.latitude.toFixed(6)}, Lng: {formData.longitude.toFixed(6)}
                </span>
              </div>
              <Button variant="glass" size="sm" onClick={handleUseCurrentLocation} icon={MapPin}>
                Use My Current Location
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <Button variant="secondary" onClick={() => setStep('details')} icon={ArrowLeft}>
              Back
            </Button>
            <Button variant="primary" onClick={handleLocationSubmit} icon={ArrowRight}>
              Next: Review
            </Button>
          </div>
        </div>
      )}

      {/* 4. REVIEW STEP */}
      {activeStepStr === 'review' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Review Submission</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Verify details before committing to municipal dispatch queue.</p>
          </div>

          <div className="glass-card rounded-2xl p-5 flex flex-col gap-5 border border-white/50">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-slate-400">Category:</span>
                <span className="font-bold text-slate-800 dark:text-white">{formData.category}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-slate-400">Title:</span>
                <span className="font-bold text-slate-800 dark:text-white">{formData.title}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-slate-400">Description:</span>
              <p className="font-medium text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                {formData.description}
              </p>
            </div>

            {formData.images.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400">Attached Images:</span>
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {formData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Attachment Preview"
                      className="w-24 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-800 bg-white"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-400">Incident Pin Map:</span>
              <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 relative shadow-sm pointer-events-none">
                <MapContainer center={[formData.latitude, formData.longitude]} zoom={14} className="w-full h-full" zoomControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[formData.latitude, formData.longitude]} icon={bluePinIcon} />
                </MapContainer>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                Location Coordinates: {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <Button variant="secondary" onClick={() => setStep('location')} icon={ArrowLeft} disabled={isSubmitting}>
              Back
            </Button>
            <Button variant="gradient" onClick={handleFinalSubmit} isLoading={isSubmitting} icon={ClipboardCheck}>
              Submit Report
            </Button>
          </div>
        </div>
      )}

      {/* 5. SUCCESS STEP */}
      {activeStepStr === 'success' && (
        <div className="flex flex-col gap-6 text-center items-center py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-2 animate-bounce">
            <ThumbsUp className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-1.5 max-w-md">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">✓ Report Submitted Successfully</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Thank you for contributing to Colombo civic safety. The dispatch dispatcher has queued your ticket for investigation.
            </p>
          </div>

          {/* Ticket Receipt */}
          <div className="w-full max-w-sm glass-card rounded-2xl p-5 border border-white/50 dark:border-slate-800/50 shadow flex flex-col gap-3 text-left">
            <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
              <span className="text-xs font-bold text-slate-400">Ticket Reference:</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-brand-purple uppercase">{formData.ticketId}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-500">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Category</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{formData.category}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Workflow Status</span>
                <span className="text-emerald-500 font-bold">Created</span>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2">
                <span className="text-[10px] text-slate-400 uppercase">Pin coordinates</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold truncate">
                  {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2">
                <span className="text-[10px] text-slate-400 uppercase">Date Filed</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button variant="secondary" onClick={() => navigate('/citizen/dashboard')}>
              Back to Dashboard
            </Button>
            <Button variant="gradient" onClick={() => navigate(`/citizen/reports`)}>
              Track Issue
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
export default ReportWizard;
