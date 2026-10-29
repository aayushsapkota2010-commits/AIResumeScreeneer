import { useEffect, useState } from "react";
import api from "../api/api";
import {
    Users,
    BriefcaseBusiness,
    CalendarCheck2,
    Trophy
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";



import "./AnalyticsDashboard.css";

const COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#10B981",
    "#EF4444"
];

function AnalyticsDashboard() {

    
const [analytics, setAnalytics] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    fetchAnalytics();
}, []);

const fetchAnalytics = async () => {
    try {
        setError("");

        const response = await api.get("/analytics/dashboard");

        if (!response.data?.statusDistribution) {
            throw new Error(
                "Analytics API did not return statusDistribution."
            );
        }

        setAnalytics(response.data);
    } catch (err) {
        console.error("Failed to load analytics:", err);
        setError(
            err.response?.data?.message ||
            err.message ||
            "Unable to load analytics."
        );
    } finally {
        setLoading(false);
    }
};

if (loading) {
    return <h2>Loading Analytics...</h2>;
}

if (error || !analytics) {
    return (
        <div className="analytics-page">
            <h2>Analytics could not be loaded</h2>
            <p>{error || "No analytics data was returned."}</p>
            <button onClick={() => {
                setLoading(true);
                fetchAnalytics();
            }}>
                Retry
            </button>
        </div>
    );
}


    const pieData = Object.entries(
        analytics.statusDistribution
    ).map(([name, value]) => ({
        name,
        value
    }));

  
const pipelineData = [
    { stage: "Applied", count: analytics.statusDistribution.Applied ?? 0 },
    { stage: "Screening", count: analytics.statusDistribution.Screening ?? 0 },
    { stage: "Shortlisted", count: analytics.statusDistribution.Shortlisted ?? 0 },
    { stage: "Interview", count: analytics.statusDistribution.Interview ?? 0 },
    { stage: "Selected", count: analytics.statusDistribution.Selected ?? 0 },
    { stage: "Rejected", count: analytics.statusDistribution.Rejected ?? 0 }
];


    return (

        <div className="analytics-page">

            <h1>Recruitment Analytics</h1>

            <div className="analytics-cards">

    <div className="dashboard-card blue">

        <div className="card-icon">
            <Users size={30}/>
        </div>

        <div>

            <h2>{analytics.totalCandidates}</h2>

            <p>Total Candidates</p>

            <span>+12% this month</span>

        </div>

    </div>

    <div className="dashboard-card green">

        <div className="card-icon">
            <BriefcaseBusiness size={30}/>
        </div>

        <div>

            <h2>{analytics.totalJobs}</h2>

            <p>Active Jobs</p>

            <span>Currently Hiring</span>

        </div>

    </div>

    <div className="dashboard-card orange">

        <div className="card-icon">
            <CalendarCheck2 size={30}/>
        </div>

        <div>

            <h2>{analytics.totalInterviews}</h2>

            <p>Interviews</p>

            <span>Scheduled</span>

        </div>

    </div>

    <div className="dashboard-card purple">

        <div className="card-icon">
            <Trophy size={30}/>
        </div>

        <div>

            <h2>{analytics.selectedCandidates}</h2>

            <p>Selected</p>

            <span>Hiring Success</span>

        </div>

    </div>

</div>

            <div className="analytics-grid">

    <div className="analytics-box">

        <h2>Recruitment Pipeline</h2>

        <ResponsiveContainer
            width="100%"
            height={350}
        >

           <BarChart
    data={pipelineData}
    layout="vertical"
    margin={{
        top: 20,
        right: 30,
        left: 60,
        bottom: 20
    }}
>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis
                    type="number"
                />

<YAxis
    type="category"
    dataKey="stage"
    width={140}
    tick={{
        fontSize: 14
    }}
/>

                <Tooltip
    cursor={{ fill: "#f5f5f5" }}
/>

               <Bar
    dataKey="count"
    fill="#5B5FEF"
    radius={[0,12,12,0]}
/>

            </BarChart>

        </ResponsiveContainer>

    </div>

    <div className="analytics-box">

        <h2>Candidate Status</h2>

        <ResponsiveContainer
            width="100%"
            height={350}
        >

            <PieChart>

                <Pie

                    data={pieData}

                    dataKey="value"

                    nameKey="name"

                    innerRadius={70}

                    outerRadius={120}

                    label

                >

                    {

                        pieData.map((entry,index)=>(

                            <Cell

                                key={index}

                                fill={COLORS[index]}

                            />

                        ))

                    }

                </Pie>

                <Legend/>

                <Tooltip/>

            </PieChart>

        </ResponsiveContainer>

    </div>

</div>

        </div>

    );

}

export default AnalyticsDashboard;