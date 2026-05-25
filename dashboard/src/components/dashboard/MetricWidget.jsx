export default function MetricWidget({ label, value, hint, accent = "default", children }) {
  return (
    <article className={`dw-metric dw-metric--${accent}`}>
      <div className="dw-metric__top">
        {children}
        <span className="dw-metric__label">{label}</span>
      </div>
      <strong className="dw-metric__value">{value}</strong>
      {hint ? <span className="dw-metric__hint">{hint}</span> : null}
    </article>
  )
}
