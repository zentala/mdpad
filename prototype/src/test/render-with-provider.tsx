/**
 * Test utility — renders components wrapped in AppStateProvider.
 * Provides the real provider so dispatch/state work correctly.
 */
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { AppStateProvider } from '@/providers/AppStateProvider'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>
}

/**
 * Render with the full AppStateProvider context.
 * Use for components that call useAppContext().
 */
export function renderWithProvider(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Wrapper, ...options })
}
