import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { useAppDispatch } from "./app/hooks";
import { loadUserFromStorage } from "./features/auth/authSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Healthcare Platform Components
import HealthcareLayout from "./components/Healthcare/HealthcareLayout";

// Authentication & Onboarding
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import RoleSelection from "./pages/Auth/RoleSelection";
import Onboarding from "./pages/Auth/Onboarding";

// Main Platform Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import GuideDashboard from "./pages/Dashboard/GuideDashboard";

// Assessment System
import AssessmentCenter from "./pages/Assessment/AssessmentCenter";
import TakeAssessment from "./pages/Assessment/TakeAssessment";
import AssessmentResults from "./pages/Assessment/AssessmentResults";
import AssessmentHistory from "./pages/Assessment/AssessmentHistory";
import { GuideAssessmentDashboard, AdminAssessmentDashboard } from "./components/Assessments";

// Content Management
import { ContentManagementDashboard } from "./components/Content";

// Community Features
import CommunityHub from "./pages/Community/CommunityHub";
import CommunityForums from "./pages/Community/CommunityForums";
import Forums from "./pages/Community/Forums";
import PeerSupport from "./pages/Community/PeerSupport";
import ChatRooms from "./pages/Community/ChatRooms";

// Wellness & Self-Care
import WellnessCenter from "./pages/Wellness/WellnessCenter";
import MoodTracker from "./pages/Wellness/MoodTracker";
import DailyChallenges from "./pages/Wellness/DailyChallenges";
import Achievements from "./pages/Wellness/Achievements";

// Content & Resources
import EducationCenter from "./pages/Education/EducationCenter";
import ResourceDirectory from "./pages/Resources/ResourceDirectory";
import CrisisResources from "./pages/Crisis/CrisisResources";
import SafetyPlanning from "./pages/Crisis/SafetyPlanning";

// Professional/Guide Features
import GuideLayout from "./layouts/GuideLayout";
import GuideVerification from "./pages/Guide/GuideVerification";
import GuideVerificationPending from "./pages/Guide/GuideVerificationPending";
import GuideVerificationFAQ from "./pages/Guide/GuideVerificationFAQ";
import ClientManagement from "./pages/Guide/ClientManagement";
import CrisisAlerts from "./pages/Guide/CrisisAlerts";
import ContentModeration from "./pages/Guide/ContentModeration";
import Analytics from "./pages/Guide/Analytics";

// Admin Features
import AdminLayout from "./layouts/AdminLayout";
import SystemAdmin from "./pages/Admin/SystemAdmin";
import UserManagement from "./pages/Admin/UserManagement";
import UserRolesInfo from "./pages/Admin/UserRolesInfo";
import ComplianceReports from "./pages/Admin/ComplianceReports";
import ContentManagement from "./pages/Admin/ContentManagement";
import AssessmentManagement from "./pages/Admin/AssessmentManagement";
import CommunityManagement from "./pages/Admin/CommunityManagement";

// Utility Components
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/Profile/UserProfile";
import Settings from "./pages/Settings/Settings";
import ProgressTracker from "./pages/Progress/ProgressTracker";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsOfService from "./pages/Legal/TermsOfService";
import MedicalDisclaimer from "./pages/Legal/MedicalDisclaimer";

// UI Components
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Healthcare Compliance
import ComplianceProvider from "./providers/ComplianceProvider";
import AccessibilityProvider from "./providers/AccessibilityProvider";

// Development Testing
import HealthcareTest from "./components/HealthcareTest";

const queryClient = new QueryClient();

const AppContent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <HealthcareLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/role-selection" element={<RoleSelection />} />

        {/* Legal & Compliance */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />

        {/* Development Testing Route */}
        {import.meta.env.DEV && (
          <Route path="/test" element={<HealthcareTest />} />
        )}

        {/* Protected User Routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireAuth={true}>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute requireAuth={true}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute requireAuth={true}>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <ProgressTracker />
            </ProtectedRoute>
          }
        />

        {/* Assessment System */}
        <Route
          path="/assessments"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <AssessmentCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments/take/:type"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <TakeAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments/results/:id"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <AssessmentResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments/history"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <AssessmentHistory />
            </ProtectedRoute>
          }
        />
        
        {/* Role-based Assessment Management */}
        <Route
          path="/assessments/guide"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <GuideAssessmentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments/admin"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <AdminAssessmentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Content Management */}
        <Route
          path="/content/manage"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <ContentManagementDashboard />
            </ProtectedRoute>
          }
        />

        {/* Community Features */}
        <Route
          path="/community"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <CommunityHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/forums"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <CommunityForums />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/peer-support"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <PeerSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/chat"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <ChatRooms />
            </ProtectedRoute>
          }
        />

        {/* Wellness & Self-Care */}
        <Route
          path="/wellness"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <WellnessCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wellness/mood-tracker"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <MoodTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wellness/challenges"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <DailyChallenges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wellness/achievements"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <Achievements />
            </ProtectedRoute>
          }
        />

        {/* Education & Resources */}
        <Route
          path="/education"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <EducationCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <ResourceDirectory />
            </ProtectedRoute>
          }
        />

        {/* Crisis Support */}
        <Route
          path="/crisis"
          element={
            <ProtectedRoute requireAuth={true}>
              <CrisisResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/safety-plan"
          element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <SafetyPlanning />
            </ProtectedRoute>
          }
        />

        {/* Guide Verification (Public) */}
        <Route path="/guide/verification" element={<GuideVerification />} />
        <Route path="/guide/verification-pending" element={<GuideVerificationPending />} />
        <Route path="/guide/verification-faq" element={<GuideVerificationFAQ />} />

        {/* Guide/Professional Routes */}
        <Route
          path="/guide"
          element={
            <ProtectedRoute requireAuth={true} requireRole="guide">
              <GuideLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GuideDashboard />} />
          <Route path="clients" element={<ClientManagement />} />
          <Route path="crisis-alerts" element={<CrisisAlerts />} />
          <Route path="moderation" element={<ContentModeration />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAuth={true} requireRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SystemAdmin />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="user-roles" element={<UserRolesInfo />} />
          <Route path="compliance" element={<ComplianceReports />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="assessments" element={<AssessmentManagement />} />
          <Route path="community" element={<CommunityManagement />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HealthcareLayout>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ComplianceProvider>
        <AccessibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </AccessibilityProvider>
      </ComplianceProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
