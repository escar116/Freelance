import { Toaster } from "./toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from "./query-client"
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from "./PageNotFound";
import { AuthProvider, useAuth } from "./AuthContext";
import UserNotRegisteredError from "./UserNotRegisteredError";
import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
// Add page imports here
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Layout from "./Layout";
import Home from "./Home";
import HelpRequests from "./HelpRequests";
import Profile from "./Profile";
import StudentProfile from "./StudentProfile";
import SearchResults from "./SearchResults";
import PendingApproval from "./PendingApproval";
import AdminDashboard from "./AdminDashboard";
import Applications from "./Applications";
import Messages from "./Messages";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pending" element={<PendingApproval />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/requests" element={<HelpRequests />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/students/:email" element={<StudentProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App