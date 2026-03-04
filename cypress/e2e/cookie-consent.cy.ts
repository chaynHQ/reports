/**
 * Cookie consent banner tests.
 *
 * Verifies GDPR consent flow, GA4 injection gating, cookie attributes,
 * and basic accessibility. Requires NEXT_PUBLIC_GA_ID to be set (see .env.local).
 *
 * GA4 is loaded via <GoogleAnalytics> from @next/third-parties, which injects a
 * script[src*="googletagmanager.com/gtag/js"] tag. anonymize_ip is deprecated in
 * GA4 (Google anonymises IP by default) and is no longer set in the config.
 */

const COOKIE = "chaynCookieConsent";
const GA4_SCRIPT = 'script[src*="googletagmanager.com/gtag/js"]';

describe("Cookie consent", () => {
  it("shows the banner on first visit", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.contains("We use analytics cookies").should("be.visible");
  });

  it("does not inject GA4 scripts or set the cookie before a choice is made", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.getCookie(COOKIE).should("be.null");
    cy.get(GA4_SCRIPT).should("not.exist");
  });

  it("accept — hides banner, sets accepted cookie with path=/, loads GA4", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.get('button[aria-label="Accept cookies"]').click();
    cy.contains("We use analytics cookies").should("not.exist");
    cy.getCookie(COOKIE).should("have.property", "value", "accepted");
    cy.getCookie(COOKIE).should("have.property", "path", "/");
    cy.get(GA4_SCRIPT, { timeout: 6000 }).should("exist");
  });

  it("decline — hides banner, sets declined cookie, does not load GA4", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.get('button[aria-label="Decline cookies"]').click();
    cy.contains("We use analytics cookies").should("not.exist");
    cy.getCookie(COOKIE).should("have.property", "value", "declined");
    cy.getCookie(COOKIE).should("have.property", "path", "/");
    cy.wait(1500);
    cy.get(GA4_SCRIPT).should("not.exist");
  });

  it("returning accepted visitor — no banner, GA4 auto-loads", () => {
    cy.clearCookies();
    cy.setCookie(COOKIE, "accepted", { path: "/" });
    cy.visit("/");
    cy.contains("We use analytics cookies").should("not.exist");
    cy.get(GA4_SCRIPT, { timeout: 6000 }).should("exist");
  });

  it("returning declined visitor — no banner, GA4 not loaded", () => {
    cy.clearCookies();
    cy.setCookie(COOKIE, "declined", { path: "/" });
    cy.visit("/");
    cy.contains("We use analytics cookies").should("not.exist");
    cy.wait(1500);
    cy.get(GA4_SCRIPT).should("not.exist");
  });

  it("consent revoked — cookie is cleared and banner reappears on reload", () => {
    cy.setCookie(COOKIE, "accepted", { path: "/" });
    cy.visit("/");
    cy.get(GA4_SCRIPT, { timeout: 6000 }).should("exist");
    // Simulate clearConsent(): clear the cookie then dispatch the consent change event
    cy.clearCookie(COOKIE);
    cy.window().then((win) =>
      win.dispatchEvent(new win.Event("chayn:consent-change")),
    );
    // On reload, banner reappears and GA4 does not load
    cy.visit("/");
    cy.contains("We use analytics cookies").should("be.visible");
    cy.wait(1500);
    cy.get(GA4_SCRIPT).should("not.exist");
  });

  it("consent cookie survives a full page reload", () => {
    cy.clearCookies();
    cy.setCookie(COOKIE, "accepted", { path: "/" });
    cy.visit("/");
    cy.visit("/");
    cy.getCookie(COOKIE).should("have.property", "value", "accepted");
    cy.contains("We use analytics cookies").should("not.exist");
  });
});

describe("Cookie settings button", () => {
  const SETTINGS_BTN = 'button[aria-label="Cookie settings"]';

  it("does not appear before a consent choice is made", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.get(SETTINGS_BTN).should("not.exist");
  });

  it("appears after accepting cookies", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.get('button[aria-label="Accept cookies"]').click();
    cy.get(SETTINGS_BTN).should("be.visible");
  });

  it("appears after declining cookies", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.get('button[aria-label="Decline cookies"]').click();
    cy.get(SETTINGS_BTN).should("be.visible");
  });

  it("clicking it reopens banner with update heading and hides the button", () => {
    cy.setCookie(COOKIE, "accepted", { path: "/" });
    cy.visit("/");
    cy.get(SETTINGS_BTN).should("be.visible").click();
    cy.contains("Update your cookie settings").should("be.visible");
    cy.get(SETTINGS_BTN).should("not.exist");
  });

  it("shows 'currently enabled' status when cookies were accepted", () => {
    cy.setCookie(COOKIE, "accepted", { path: "/" });
    cy.visit("/");
    cy.get(SETTINGS_BTN).click();
    cy.contains("Cookies are currently enabled.").should("be.visible");
  });

  it("shows 'currently disabled' status when cookies were declined", () => {
    cy.setCookie(COOKIE, "declined", { path: "/" });
    cy.visit("/");
    cy.get(SETTINGS_BTN).click();
    cy.contains("Cookies are currently disabled.").should("be.visible");
  });

  it("banner closes and button reappears after making a new choice in update mode", () => {
    cy.setCookie(COOKIE, "accepted", { path: "/" });
    cy.visit("/");
    cy.get(SETTINGS_BTN).click();
    cy.contains("Update your cookie settings").should("be.visible");
    cy.get('button[aria-label="Decline cookies"]').click();
    cy.contains("Update your cookie settings").should("not.exist");
    cy.get(SETTINGS_BTN).should("be.visible");
  });

  it("appears again for a returning visitor (cookie already set)", () => {
    cy.setCookie(COOKIE, "declined", { path: "/" });
    cy.visit("/");
    cy.get(SETTINGS_BTN).should("be.visible");
  });

  it("GA4 script is neutered after revoking consent mid-session", () => {
    cy.setCookie(COOKIE, "accepted", { path: "/" });
    cy.visit("/");
    cy.get(GA4_SCRIPT, { timeout: 6000 }).should("exist");
    // Wait for gtag to initialise, then stub it to capture consent update calls.
    // The external gtag.js script loads asynchronously and can reassign window.gtag
    // after our code nulls it, so checking window.gtag === undefined is unreliable.
    // Instead, verify the GA4 Consent Mode v2 signal was sent — that is what stops
    // data collection.
    cy.window().should("have.property", "gtag").and("be.a", "function");
    cy.window().then((win) => {
      cy.stub(win, "gtag").as("gtag");
    });
    // Revoke consent via settings button
    cy.get(SETTINGS_BTN).click();
    cy.get('button[aria-label="Decline cookies"]').click();
    // GA4 Consent Mode v2 must signal analytics_storage denied
    cy.get("@gtag").should(
      "have.been.calledWith",
      "consent",
      "update",
      Cypress.sinon.match({ analytics_storage: "denied" }),
    );
  });
});

describe("Cookie consent accessibility", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("/");
  });

  it("banner is a region landmark with an accessible name", () => {
    cy.get('[role="region"][aria-label="Cookie consent"]').should("exist");
  });

  it("buttons have aria-labels and are keyboard focusable", () => {
    cy.get('button[aria-label="Accept cookies"]')
      .should("be.visible")
      .and("not.have.attr", "tabindex", "-1");
    cy.get('button[aria-label="Decline cookies"]')
      .should("be.visible")
      .and("not.have.attr", "tabindex", "-1");
  });

  it("privacy policy link is visible and has an href", () => {
    cy.contains("a", "Privacy policy")
      .should("be.visible")
      .and("have.attr", "href");
  });
});
