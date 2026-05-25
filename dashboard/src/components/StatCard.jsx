export default function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p className="label">{title}</p>
      <h3 className="value">{value}</h3>
    </div>
  )
}