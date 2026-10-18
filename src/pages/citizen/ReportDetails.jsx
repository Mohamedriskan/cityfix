import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Timeline } from '../../components/common/Timeline';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Toast } from '../../components/common/Toast';
import { LoadingState } from '../../components/common/LoadingState';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MessageSquare, Star, Send, MapPin, Calendar, Building, Sparkles } from 'lucide-react';

const bluePinIcon = L.divIcon({
  html: `<span class="relative flex h-6 w-6">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
    <span class="relative inline-flex rounded-full h-6 w-6 bg-brand-blue border-2 border-white shadow-lg"></span>
  </span>`,
  className: 'custom-pin-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getIssueById, addComment, submitFeedback, loading: contextLoading } = useIssues();

  const issue = getIssueById(id);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(issue.id, newComment);
      setNewComment('');
      setToastType('success');
      setToastMsg('Comment added successfully!');
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || 'Failed to post comment.');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback(issue.id, rating, feedbackComment);
      setToastType('success');
      setToastMsg('Thank you! Feedback submitted successfully.');
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || 'Failed to submit feedback.');
    }
  };

  if (contextLoading && !issue) {
    return <LoadingState message="Loading ticket information details..." />;
  }

  if (!issue) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <p className="text-sm font-bold text-slate-500">Ticket not found.</p>
        <Button variant="secondary" onClick={() => navigate('/citizen/reports')} icon={ArrowLeft}>
          Back to Reports List
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}

      <PageHeader
        title={`Track Ticket: ${issue.ticketId}`}
        subtitle={issue.title}
        breadcrumbs={[
          { label: 'My Reports', link: '/citizen/reports' },
          { label: issue.ticketId, link: `/citizen/reports/${issue.id}` }
        ]}
        actions={
          <Button variant="secondary" onClick={() => navigate('/citizen/reports')} icon={ArrowLeft}>
            Back
          </Button>
        }
      />

      {/* Main timeline wrapper */}
      <div className="glass-card rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
        <Timeline currentStatus={issue.status} comments={issue.comments} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Ticket Info Details */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Details card */}
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase select-none">
                Details
              </span>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={issue.priority} />
                <StatusBadge status={issue.status} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {issue.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {issue.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mt-2 border-t border-slate-100 dark:border-slate-800/50 pt-4 font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">Filed Date</span>
                  <span className="text-slate-800 dark:text-slate-200">{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">Department</span>
                  <span className="text-slate-800 dark:text-slate-200">{issue.department || 'Awaiting Routing'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">Coordinates</span>
                  <span className="text-slate-800 dark:text-slate-200 truncate">{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {issue.image && (
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400">Attached Media:</span>
                <div className="max-w-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white">
                  <img src={issue.image} alt="Ticket attachment" className="w-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* Citizen Feedback Form (when status is Completed) */}
          {issue.status === 'Completed' && (
            <div className="glass-card rounded-2xl p-5 border border-l-4 border-l-brand-purple flex flex-col gap-4 shadow-sm bg-gradient-to-tr from-brand-purple/5 via-transparent to-transparent">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                <h3 className="font-bold text-slate-800 dark:text-white">Submit Resolution Feedback</h3>
              </div>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                The municipal team has marked this ticket resolved. Please tell us about your experience to complete the ticket workflow.
              </p>
              
              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 mr-2 select-none">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= rating 
                            ? 'text-amber-500 fill-amber-500' 
                            : 'text-slate-300 dark:text-slate-700'
                        }`} 
                      />
                    </button>
                  ))}
                </div>

                <Textarea
                  placeholder="Leave details about the work quality (optional)..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  rows={2}
                />

                <Button type="submit" variant="gradient-purple" className="w-fit self-end">
                  Submit Review
                </Button>
              </form>
            </div>
          )}

          {/* Feedback Displayed (when Citizen Feedback has been submitted) */}
          {issue.status === 'Citizen Feedback' && issue.feedback && (
            <div className="glass-card rounded-2xl p-5 border border-l-4 border-l-emerald-500 flex flex-col gap-2.5 shadow-sm bg-emerald-55/5 dark:bg-emerald-950/5">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm uppercase">
                Citizen Satisfaction Review
              </h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4.5 h-4.5 ${
                      star <= issue.feedback.rating 
                        ? 'text-amber-500 fill-amber-500' 
                        : 'text-slate-300 dark:text-slate-700'
                    }`} 
                  />
                ))}
                <span className="text-xs text-slate-400 font-bold ml-2">Rating: {issue.feedback.rating}/5</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic">
                "{issue.feedback.comment || 'No review comments left.'}"
              </p>
            </div>
          )}

          {/* Messages / Comments panel */}
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 select-none border-b border-slate-200/50 pb-3">
              <MessageSquare className="w-4 h-4 text-brand-blue" />
              Officer Dialogue Console
            </h3>

            {/* Chat Box */}
            <form onSubmit={handleAddComment} className="flex gap-3">
              <Input
                placeholder="Post a query or update note to the field team..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" variant="glass" icon={Send} className="px-4.5">
                Send
              </Button>
            </form>
          </div>

        </div>

        {/* Right column: Map Location pin */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-4 flex flex-col gap-3 shadow-sm h-64">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
              Location Coordinates Map
            </span>
            <div className="w-full flex-1 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-inner relative">
              <MapContainer 
                key={[issue.latitude, issue.longitude].join(',')}
                center={[issue.latitude, issue.longitude]} 
                zoom={14} 
                className="w-full h-full"
                zoomControl={false}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[issue.latitude, issue.longitude]} icon={bluePinIcon} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default ReportDetails;
