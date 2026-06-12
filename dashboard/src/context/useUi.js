import { useContext } from "react"
import { UiContext } from "./ui-store.js"

export function useUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error("useUi debe usarse dentro de UiProvider.")
  return ctx
}
