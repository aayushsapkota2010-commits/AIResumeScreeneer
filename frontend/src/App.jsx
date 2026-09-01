import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import ResumeList from "./pages/ResumeList";
import ResumeDetails from "./pages/ResumeDetails";
import SearchFilter from "./pages/SearchFilter";
import PipelineBoard from "./pages/PipelineBoard";
import CandidateManagement from "./pages/CandidateManagement";
import CandidateProfile from "./pages/CandidateProfile";
import JobPosts from "./pages/JobPosts";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import AdminUsers from "./pages/AdminUsers";
import ActivityFeed from "./pages/ActivityFeed";
import CandidateDashboard from "./pages/CandidateDashboard";
import KanbanBoard from "./pages/KanbanBoard";
import InterviewDashboard from "./pages/InterviewDashboard";
import Settings from "./pages/Settings";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    DEFAULT
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />


                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =========================
                    MAIN DASHBOARD
                ========================= */}

                <Route
                    path="/dashboard"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    UPLOAD RESUME
                ========================= */}

                <Route
                    path="/upload"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <UploadResume />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    RESUME LIBRARY
                ========================= */}

                <Route
                    path="/resumes"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <ResumeList />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    RESUME DETAILS
                ========================= */}

                <Route
                    path="/resume/:id"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <ResumeDetails />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    SEARCH / FILTER
                ========================= */}

                <Route
                    path="/search"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <SearchFilter />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    PIPELINE
                ========================= */}

                <Route
                    path="/pipeline"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <PipelineBoard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    CANDIDATES
                ========================= */}

                <Route
                    path="/candidates"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <CandidateManagement />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    CANDIDATE PROFILE
                ========================= */}

                <Route
                    path="/candidate/:id"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <CandidateProfile />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    INTERVIEWS
                ========================= */}

                <Route
                    path="/interviews"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <InterviewDashboard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    JOB POSTS
                ========================= */}

                <Route
                    path="/jobs"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <JobPosts />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ANALYTICS
                ========================= */}

                <Route
                    path="/analytics"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <AnalyticsDashboard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    USERS
                ========================= */}

                <Route
                    path="/users"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <AdminUsers />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ACTIVITY FEED
                ========================= */}

                <Route
                    path="/activity-feed"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <ActivityFeed />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    CANDIDATE DASHBOARD
                ========================= */}

                <Route
                    path="/candidate-dashboard"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <CandidateDashboard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    KANBAN
                ========================= */}

                <Route
                    path="/kanban"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <KanbanBoard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    SETTINGS
                ========================= */}

                <Route
                    path="/settings"
                    element={
                        <Layout>
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    FALLBACK
                ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;