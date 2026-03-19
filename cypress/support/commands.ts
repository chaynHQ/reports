export {};

/**
 * Custom Cypress commands for the Chayn scrollytelling report.
 *
 * These commands are designed to help test scroll-driven interactions,
 * GSAP animations, and dynamically imported Client Components that only
 * mount once a section enters the viewport.
 */

/**
 * Scroll to a percentage depth of the total page height.
 *
 * Useful for triggering GSAP ScrollTrigger breakpoints and lazy-loaded
 * Client Components that use IntersectionObserver.
 *
 * @example
 *   cy.scrollToDepth(50) // scroll halfway down the page
 *   cy.scrollToDepth(100) // scroll to the very bottom
 */
Cypress.Commands.add("scrollToDepth", (percent: number) => {
  cy.window().then((win) => {
    const totalHeight = win.document.documentElement.scrollHeight;
    const target = Math.floor(
      (totalHeight * Math.min(Math.max(percent, 0), 100)) / 100,
    );
    win.scrollTo({ top: target, behavior: "smooth" });
  });
});

/**
 * Assert that an element is currently visible within the viewport.
 *
 * Use this after scrolling to confirm that a scrollytelling section has
 * entered view and therefore any deferred animations/imports should have
 * been triggered.
 *
 * @example
 *   cy.scrollToDepth(60)
 *   cy.waitForInViewport('[data-section="impact"]')
 */
Cypress.Commands.add("waitForInViewport", (selector: string) => {
  cy.get(selector).should(($el) => {
    const rect = $el[0].getBoundingClientRect();
    expect(rect.top, "element top edge").to.be.lessThan(window.innerHeight);
    expect(rect.bottom, "element bottom edge").to.be.greaterThan(0);
  });
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Scroll to a percentage depth of the total page height (0–100).
       */
      scrollToDepth(percent: number): Chainable<void>;
      /**
       * Assert that a selector is currently visible inside the viewport.
       */
      waitForInViewport(selector: string): Chainable<void>;
    }
  }
}
