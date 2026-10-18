import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Timeline } from '../../components/common/Timeline';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { Input } from '../../components/common/Input';
import { Toast } from '../../components/common/Toast';
import { LoadingState } from '../../components/common/LoadingState';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, User, Phone, Mail, Building, Clock, Tag, MessageSquare, Send, Calendar, Award } from 'lucide-react';

const redPinIcon = L.divIcon({
  html: `<span class="relative flex h-6 w-6">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-6 w-6 bg-red-500 border-2 border-white shadow-lg"></span>
  </span>`,
  className: 'custom-pin-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getIssueById, 
    updateIssueStatus, 
    assignDepartment, 
    setPriority, 
    addComment,
    loading: contextLoading
  } = useIssues();

  const issue = getIssueById(id);
  const [newComment, setNewComment] = useState('');
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const handleStatusChange = async (e) => {
    const nextStatus = e.target.value;
    if (!nextStatus) return;
    try {
      await updateIssueStatus(issue.id, nextStatus);
      setToastType('success');
      setToastMsg(`Status changed to "${nextStatus}"`);
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || 'Failed to update status');
    }
  };

  const handleDeptChange = async (e) => {
    const nextDept = e.target.value;
    if (!nextDept) return;
    try {
      await assignDepartment(issue.id, nextDept);
      setToastType('success');
      setToastMsg(`Department reassigned to "${nextDept}"`);
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || 'Failed to update department');
    }
  };

  const handlePriorityChange = async (e) => {
    const nextPriority = e.target.value;
    if (!nextPriority) return;
    try {
      await setPriority(issue.id, nextPriority);
      setToastType('success');
      setToastMsg(`Priority elevated to "${nextPriority}"`);
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || 'Failed to update priority');
    }
  };

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

  if (contextLoading && !issue) {
    return <LoadingState message="Loading ticket details..." />;
  }

  if (!issue) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <p className="text-sm font-bold text-slate-500">Ticket not found.</p>
        <Button variant="secondary" onClick={() => navigate('/officer/issues')} icon={ArrowLeft}>
          Back to Queue
        </Button>
      </div>
    );
  }

  const departmentsList = [
    'Roads Department', 'Waste Management', 'Water Supply', 'Electricity',
    'Drainage', 'Public Safety', 'Parks & Recreation', 'Sanitation'
  ];

  const statusesList = ['Created', 'Verification', 'Assigned', 'Working', 'Completed'];
  const prioritiesList = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="flex flex-col gap-6 text-left">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}

      <PageHeader
        title={`Review Ticket: ${issue.ticketId}`}
        subtitle={issue.title}
        breadcrumbs={[
          { label: 'Operations Queue', link: '/officer/issues' },
          { label: issue.ticketId, link: `/officer/issues/${issue.id}` }
        ]}
        actions={
          <Button variant="secondary" onClick={() => navigate('/officer/issues')} icon={ArrowLeft}>
            Back to Queue
          </Button>
        }
      />

      {/* Timeline tracker */}
      <div className="glass-card rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/50">
        <Timeline currentStatus={issue.status} comments={issue.comments} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left pane: Details + Comment log */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-800/40 pb-3 select-none">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                Citizen Incident Report
              </span>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={issue.priority} />
                <StatusBadge status={issue.status} />
              </div>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-snug">
                {issue.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                {issue.description}
              </p>
            </div>

            {issue.image && (
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400">Citizen Attachment:</span>
                <div className="max-w-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
                  <img src={issue.image} alt="Incident attachment" className="w-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* Dialogue Log Console */}
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 select-none border-b border-slate-200/50 pb-3">
              <MessageSquare className="w-4 h-4 text-brand-blue" />
              Dialogue log with Citizen
            </h3>

            <form onSubmit={handleAddComment} className="flex gap-3">
              <Input
                placeholder="Type messages or dispatcher checklist updates..."
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

        {/* Right pane: Action Controls + Maps */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Action Dashboard Controls */}
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm select-none">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/50 pb-2 mb-1">
              Operations Controls
            </h3>

            {/* Change Status */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Update Ticket Status
              </span>
              <Select
                value={issue.status}
                onChange={handleStatusChange}
                options={statusesList}
                className="text-xs font-semibold"
              />
            </div>

            {/* Change Department */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Route Department
              </span>
              <Select
                value={issue.department}
                onChange={handleDeptChange}
                options={departmentsList}
                className="text-xs font-semibold"
              />
            </div>

            {/* Change Priority */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Set Priority Level
              </span>
              <Select
                value={issue.priority}
                onChange={handlePriorityChange}
                options={prioritiesList}
                className="text-xs font-semibold"
              />
            </div>
          </div>

          {/* Citizen profile */}
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 shadow-sm select-none">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/50 pb-2">
              Citizen Profile
            </h3>
            <div className="flex flex-col gap-2.5 text-xs text-slate-500">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-700 dark:text-slate-300">{issue.citizen.name}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{issue.citizen.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{issue.citizen.email}</span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="glass-card rounded-2xl p-4 flex flex-col gap-3 shadow-sm h-64 select-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verification Pin Map
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
                <Marker position={[issue.latitude, issue.longitude]} icon={redPinIcon} />
              </MapContainer>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
export default IssueDetails;
