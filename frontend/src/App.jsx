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
import UserProfile from "./pages/UserProfile";
import BrowseJobs from "./pages/BrowseJobs";
import MyResumes from "./pages/MyResumes";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";

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
                    ADMIN DASHBOARD
                ========================= */}

                <Route
                    path="/dashboard"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <Dashboard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - UPLOAD RESUME
                ========================= */}

                <Route
                    path="/upload"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <UploadResume />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - RESUME LIBRARY
                ========================= */}

                <Route
                    path="/resumes"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <ResumeList />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - RESUME DETAILS
                ========================= */}

                <Route
                    path="/resume/:id"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <ResumeDetails />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - SEARCH / FILTER
                ========================= */}

                <Route
                    path="/search"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <SearchFilter />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - PIPELINE
                ========================= */}

                <Route
                    path="/pipeline"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <PipelineBoard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - CANDIDATES
                ========================= */}

                <Route
                    path="/candidates"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <CandidateManagement />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - CANDIDATE PROFILE
                ========================= */}

                <Route
                    path="/candidate/:id"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <CandidateProfile />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - JOB POSTS
                ========================= */}

                <Route
                    path="/jobs"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <JobPosts />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - ANALYTICS
                ========================= */}

                <Route
                    path="/analytics"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AnalyticsDashboard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - USERS
                ========================= */}

                <Route
                    path="/users"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AdminUsers />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - ACTIVITY FEED
                ========================= */}

                <Route
                    path="/activity-feed"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <ActivityFeed />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN - KANBAN
                ========================= */}

                <Route
                    path="/kanban"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <KanbanBoard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN / USER - INTERVIEWS
                ========================= */}

                <Route
                    path="/interviews"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN", "USER"]}>
                                <InterviewDashboard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    USER - CANDIDATE DASHBOARD
                ========================= */}

                <Route
                    path="/candidate-dashboard"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["USER"]}>
                                <CandidateDashboard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    USER - BROWSE JOBS
                ========================= */}

                <Route
                    path="/browse-jobs"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["USER"]}>
                                <BrowseJobs />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    USER - PROFILE
                ========================= */}

                <Route
                    path="/profile"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["USER"]}>
                                <UserProfile />
                            </ProtectedRoute>
                        </Layout>
                    }
                />


                {/* =========================
                    ADMIN / USER - SETTINGS
                ========================= */}

                <Route
                    path="/settings"
                    element={
                        <Layout>
                            <ProtectedRoute allowedRoles={["ADMIN", "USER"]}>
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

                <Route
    path="/my-resumes"
    element={
        <Layout>
            <ProtectedRoute allowedRoles={["USER"]}>
                <MyResumes />
            </ProtectedRoute>
        </Layout>
    }
/>
<Route
    path="/jobs/:id"
    element={
        <Layout>
            <ProtectedRoute allowedRoles={["USER"]}>
                <JobDetails />
            </ProtectedRoute>
        </Layout>
    }
/>
<Route
    path="/apply/:id"
    element={
        <Layout>
            <ProtectedRoute allowedRoles={["USER"]}>
                <ApplyJob />
            </ProtectedRoute>
        </Layout>
    }
/>
<Route
    path="/my-applications"
    element={
        <Layout>
            <ProtectedRoute allowedRoles={["USER"]}>
                <MyApplications />
            </ProtectedRoute>
        </Layout>
    }
/>

            </Routes>

        </BrowserRouter>
    );
}

export default App;