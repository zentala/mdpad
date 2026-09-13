import '@testing-library/jest-dom/vitest'

/** jsdom does not implement scrollIntoView (used by search match highlighting) */
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {}
}

/** jsdom does not implement IntersectionObserver (used by TOC active-heading tracking) */
if (!('IntersectionObserver' in window)) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ''
    readonly thresholds: ReadonlyArray<number> = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  // @ts-expect-error jsdom global lacks the browser IntersectionObserver type
  window.IntersectionObserver = MockIntersectionObserver
  // @ts-expect-error same as above for the bare global
  globalThis.IntersectionObserver = MockIntersectionObserver
}

/** Mock matchMedia for jsdom (used by auto-theme detection) */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
