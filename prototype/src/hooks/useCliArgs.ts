/**
 * useCliArgs — listens for CLI argument events from the Tauri backend.
 * Only active when running inside a Tauri window.
 */
import { useEffect, useRef } from 'react'
import { IS_TAURI } from '@/data'

/** Payload emitted by the Rust backend with resolved CLI arguments. */
export interface CliArgsPayload {
  rootPath: string
  initialFile: string | null
}

/**
 * Hook that listens for the `cli_args` event from Tauri and invokes
 * a callback with the parsed payload. No-op in browser mode.
 */
export function useCliArgs(onArgs: (args: CliArgsPayload) => void): void {
  const onArgsRef = useRef(onArgs)
  onArgsRef.current = onArgs

  useEffect(() => {
    if (!IS_TAURI) return

    let unlisten: (() => void) | null = null

    import('@tauri-apps/api/event').then(({ listen }) => {
      listen<CliArgsPayload>('cli_args', event => {
        onArgsRef.current(event.payload)
      }).then(fn => {
        unlisten = fn
      })
    })

    return () => {
      unlisten?.()
    }
  }, [])
}
