import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/common/LoadingState';

// Layout Wrappers
import { PublicLayout } from '../layouts/PublicLayout';
import { CitizenLayout } from '../layouts/CitizenLayout';
import { OfficerLayout } from '../layouts/OfficerLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { LandingPage } from '../pages/LandingPage';
import { HowItWorks } from '../pages/HowItWorks';
import { Transparency } from '../pages/Transparency';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

// Citizen Pages
import { Dashboard as CitizenDashboard } from '../pages/citizen/Dashboard';
import { ReportWizard } from '../pages/citizen/ReportWizard';
import { ReportsList as CitizenReportsList } from '../pages/citizen/ReportsList';
import { ReportDetails as CitizenReportDetails } from '../pages/citizen/ReportDetails';
import { Notifications as CitizenNotifications } from '../pages/citizen/Notifications';
import { Profile as CitizenProfile } from '../pages/citizen/Profile';

// Officer Pages
import { Dashboard as OfficerDashboard } from '../pages/officer/Dashboard';
import { IssuesList as OfficerIssuesList } from '../pages/officer/IssuesList';
import { IssueDetails as OfficerIssueDetails } from '../pages/officer/IssueDetails';
import { OfficerMap } from '../pages/officer/OfficerMap';
import { SlaMonitoring } from '../pages/officer/SlaMonitoring';
import { Messages } from '../pages/officer/Messages';
import { OfficerReports } from '../pages/officer/OfficerReports';

// Admin Pages
import { Overview as AdminOverview } from '../pages/admin/Overview';
import { IssuesCatalog as AdminIssuesCatalog } from '../pages/admin/IssuesCatalog';
import { Analytics as AdminAnalytics } from '../pages/admin/Analytics';
import { HeatMap as AdminHeatMap } from '../pages/admin/HeatMap';
import { Departments as AdminDepartments } from '../pages/admin/Departments';
import { UsersList as AdminUsersList } from '../pages/admin/Users';
import { SlaEscalation as AdminSlaEscalation } from '../pages/admin/SlaEscalation';
import { NotificationsCenter as AdminNotifications } from '../pages/admin/Notifications';
import { Reports as AdminReports } from '../pages/admin/Reports';
import { Settings as AdminSettings } from '../pages/admin/Settings';

// Role authorization gate wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-brand-slate-950 text-slate-500 font-bold select-none">
        <LoadingState message="Verifying session credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    // Re-route to landing on auth errors
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingState message="Loading page assets..." />}>
      <Routes>
        
        {/* PUBLIC ROUTE SCOPES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* CITIZEN PROTECTED LAYOUT PATHS */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <CitizenLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<CitizenDashboard />} />
          {/* Support sub-path wizard routes */}
          <Route path="report" element={<Navigate to="/citizen/report/category" replace />} />
          <Route path="report/category" element={<ReportWizard />} />
          <Route path="report/details" element={<ReportWizard />} />
          <Route path="report/location" element={<ReportWizard />} />
          <Route path="report/review" element={<ReportWizard />} />
          <Route path="report/success" element={<ReportWizard />} />
          
          <Route path="reports" element={<CitizenReportsList />} />
          <Route path="reports/:id" element={<CitizenReportDetails />} />
          <Route path="notifications" element={<CitizenNotifications />} />
          <Route path="profile" element={<CitizenProfile />} />
        </Route>

        {/* OFFICER PROTECTED LAYOUT PATHS */}
        <Route
          path="/officer"
          element={
            <ProtectedRoute allowedRoles={['officer']}>
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<OfficerDashboard />} />
          <Route path="issues" element={<OfficerIssuesList />} />
          <Route path="issues/:id" element={<OfficerIssueDetails />} />
          <Route path="map" element={<OfficerMap />} />
          <Route path="sla" element={<SlaMonitoring />} />
          <Route path="messages" element={<Messages />} />
          <Route path="reports" element={<OfficerReports />} />
        </Route>

        {/* ADMIN PROTECTED LAYOUT PATHS */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="issues" element={<AdminIssuesCatalog />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="heatmap" element={<AdminHeatMap />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="users" element={<AdminUsersList />} />
          <Route path="sla" element={<AdminSlaEscalation />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* FALLBACK CATCHALLS */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
};
export default AppRoutes;
