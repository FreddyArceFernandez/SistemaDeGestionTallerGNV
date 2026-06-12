import {
  useCallback,
  useMemo,
  useRef,
  useState
} from "react"
import { UiContext } from "./ui-store.js"

function ToastStack({ toasts }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`} role="status">
          <span className="toast__message">{t.message}</span>
        </div>
      ))}
    </div>
  )
}

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant,
  onConfirm,
  onCancel
}) {
  return (
    <div className="confirm-overlay" role="presentation" onClick={onCancel}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title" className="confirm-dialog__title">
          {title}
        </h3>
        <p id="confirm-message" className="confirm-dialog__message">
          {message}
        </p>
        <div className="confirm-dialog__actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export function UiProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [confirmState, setConfirmState] = useState(null)
  const confirmResolveRef = useRef(null)

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = "info") => {
      const id = `${Date.now()}-${Math.random()}`
      setToasts((prev) => [...prev, { id, message, type }])
      window.setTimeout(() => dismissToast(id), 4200)
    },
    [dismissToast]
  )

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve
      setConfirmState({
        title: options.title ?? "Confirmar",
        message: options.message ?? "¿Desea continuar?",
        confirmLabel: options.confirmLabel ?? "Confirmar",
        cancelLabel: options.cancelLabel ?? "Cancelar",
        variant: options.variant ?? "default"
      })
    })
  }, [])

  const finishConfirm = useCallback((result) => {
    setConfirmState(null)
    const resolve = confirmResolveRef.current
    confirmResolveRef.current = null
    resolve?.(result)
  }, [])

  const toast = useMemo(
    () => ({
      show: showToast,
      success: (message) => showToast(message, "success"),
      error: (message) => showToast(message, "error"),
      info: (message) => showToast(message, "info")
    }),
    [showToast]
  )

  return (
    <UiContext.Provider value={{ toast, confirm }}>
      {children}
      <ToastStack toasts={toasts} />
      {confirmState ? (
        <ConfirmDialog
          {...confirmState}
          onConfirm={() => finishConfirm(true)}
          onCancel={() => finishConfirm(false)}
        />
      ) : null}
    </UiContext.Provider>
  )
}
