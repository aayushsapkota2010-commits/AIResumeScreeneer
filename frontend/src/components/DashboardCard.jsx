import "./DashboardCard.css";

function DashboardCard({ title, value, color }) {
  return (
    <div className="dashboard-card">
      <p>{title}</p>
      <h2 style={{ color }}>{value}</h2>
    </div>
  );
}

export default DashboardCard;