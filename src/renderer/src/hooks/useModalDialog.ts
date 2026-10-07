import { useEffect, useRef, type SyntheticEvent, type RefObject, type KeyboardEvent } from 'react'

export function useModalDialog(
  onClose: () => void,
  busy: boolean
): {
  dialogRef: RefObject<HTMLDialogElement | null>
  cancel: (event: SyntheticEvent<HTMLDialogElement>) => void
  handleKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => void
} {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    dialog.querySelector<HTMLElement>('input, select, textarea')?.focus()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [])

  function cancel(event: SyntheticEvent<HTMLDialogElement>): void {
    event.preventDefault()
    if (!busy) onClose()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>): void {
    if (event.key !== 'Tab') return
    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]'
      )
    ).filter((control) => control.getClientRects().length > 0)
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (!first) {
      event.preventDefault()
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return { dialogRef, cancel, handleKeyDown }
}
