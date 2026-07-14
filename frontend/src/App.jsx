import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Layout from "./components/Layout";
import CandidateProfile from "./pages/CandidateProfile";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import CandidateManagement from "./pages/CandidateManagement";

import ResumeList from "./pages/ResumeList";
import ResumeDetails from "./pages/ResumeDetails";
import SearchFilter from "./pages/SearchFilter";
import PipelineBoard from "./pages/PipelineBoard";
import Login from "./pages/Login";
import ProtectedRoute
from "./components/ProtectedRoute";
import AdminUsers

from "./pages/AdminUsers";
import ActivityFeed
from "./pages/ActivityFeed";

import CandidateDashboard
from "./pages/CandidateDashboard";

import KanbanBoard
from "./pages/KanbanBoard";

import InterviewDashboard from "./pages/InterviewDashboard";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate to="/dashboard" />
                    }
                />

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

                <Route
                    path="/resumes"
                    element={
                        <Layout>
                            <ResumeList />
                        </Layout>
                    }
                />

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

                <Route
    path="/login"
    element={<Login />}
/>

<Route
    path="/admin/users"
    element={
        <Layout>
            <AdminUsers />
        </Layout>
    }
/>

<Route
    path="/activity-feed"
    element={
        <Layout>
            <ActivityFeed />
        </Layout>
    }
/>
<Route
    path="/candidate-dashboard"
    element={
        <Layout>
            <CandidateDashboard />
        </Layout>
    }
/>
<Route
    path="/kanban"
    element={
        <Layout>
            <KanbanBoard />
        </Layout>
    }
/>
<Route
    path="/candidates"
    element={<CandidateManagement />}
/>
<Route
    path="/candidate/:id"
    element={<CandidateProfile />}
/>

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

            </Routes>


        </BrowserRouter>
    );
}

export default App;
