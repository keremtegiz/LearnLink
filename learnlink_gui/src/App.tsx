import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import ChatroomsPage from "./pages/ChatroomsPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import CoursesPage from "./pages/CoursesPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import EventsPage from "./pages/EventsPage";
import ProgressPage from "./pages/ProgressPage";
import SupportPage from "./pages/SupportPage";
import Layout from "./components/Layout/Layout";

import RouteGuard from './components/RouteGuard';
import AuthRedirect from './components/AuthRedirect';
import DirectMessagesPage from './pages/DirectMessagesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseAreaWrapper from './components/Course/CourseAreaWrapper';
import CourseArea from "./components/Course/CourseArea";
import RouteChangeTracker from "./components/RouteChangeTracker";
import './styles/global.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <Router>
            <RouteChangeTracker />
            <Routes>
              {/* Auth Routes - No Layout */}
              <Route path="/" element={<AuthRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              {/* Protected Routes - With Layout */}
              <Route element={<RouteGuard><Layout /></RouteGuard>}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/chatrooms" element={<ChatroomsPage />} />
                <Route path="/connections" element={<ConnectionsPage />} />
                <Route path="/courses" element={<CoursesPage />}>
                  <Route index element={<CourseAreaWrapper />} />
                  <Route path=":courseId" element={<CourseDetailPage />} />
                </Route>
                <Route path="/assignments" element={<AssignmentsPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/direct-messages" element={<DirectMessagesPage />} />
              </Route>
            </Routes>
          </Router>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
