import { useState } from "react"
import { BRAND_LOGO_SRC, BRAND_NAME } from "../config/brand"

export default function BrandLogo({ variant = "sidebar", className = "" }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`brand-logo brand-logo--${variant} ${className}`.trim()}>
      {!failed ? (
        <img src={BRAND_LOGO_SRC} alt={BRAND_NAME} onError={() => setFailed(true)} />
      ) : (
        <span className="brand-logo__fallback" aria-hidden>
          R
        </span>
      )}
    </div>
  )
}
