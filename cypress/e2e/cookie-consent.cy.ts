/**
 * Cookie consent banner tests.
 *
 * Verifies GDPR consent flow, GA4 injection gating, cookie attributes,
 * and basic accessibility. Requires NEXT_PUBLIC_GA_ID to be set (see .env.local).
 */

const COOKIE = "chaynCookieConsent";

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
    cy.get("script#ga4-script").should("not.exist");
    cy.get("script#ga4-config").should("not.exist");
  });

  it("accept — hides banner, sets accepted cookie with path=/, loads GA4 with anonymize_ip", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.get('button[aria-label="Accept cookies"]').click();
    cy.contains("We use analytics cookies").should("not.exist");
    cy.getCookie(COOKIE).should("have.property", "value", "accepted");
    cy.getCookie(COOKIE).should("have.property", "path", "/");
    cy.get("script#ga4-config", { timeout: 6000 }).should(($s) => {
      expect($s.text()).to.include("anonymize_ip: true");
      expect($s.text()).to.match(/gtag\('config',\s*'G-[A-Z0-9]+'/i);
    });
  });

  it("decline — hides banner, sets declined cookie, does not load GA4", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.get('button[aria-label="Decline cookies"]').click();
    cy.contains("We use analytics cookies").should("not.exist");
    cy.getCookie(COOKIE).should("have.property", "value", "declined");
    cy.getCookie(COOKIE).should("have.property", "path", "/");
    cy.wait(1500);
    cy.get("script#ga4-script").should("not.exist");
    cy.get("script#ga4-config").should("not.exist");
  });

  it("returning accepted visitor — no banner, GA4 auto-loads with anonymize_ip", () => {
    cy.clearCookies();
    cy.setCookie(COOKIE, "accepted", { path: "/" });
    cy.visit("/");
    cy.contains("We use analytics cookies").should("not.exist");
    cy.get("script#ga4-config", { timeout: 6000 }).should(($s) => {
      expect($s.text()).to.include("anonymize_ip: true");
    });
  });

  it("returning declined visitor — no banner, GA4 not loaded", () => {
    cy.clearCookies();
    cy.setCookie(COOKIE, "declined", { path: "/" });
    cy.visit("/");
    cy.contains("We use analytics cookies").should("not.exist");
    cy.wait(1500);
    cy.get("script#ga4-script").should("not.exist");
  });

  it("consent revoked — cookie is cleared and banner reappears on reload", () => {
    cy.setCookie(COOKIE, "accepted", { path: "/" });
    cy.visit("/");
    cy.get("script#ga4-config", { timeout: 6000 }).should("exist");
    // Simulate clearConsent(): clear the cookie then dispatch the consent change event
    cy.clearCookie(COOKIE);
    cy.window().then((win) =>
      win.dispatchEvent(new win.Event("chayn:consent-change")),
    );
    // On reload, banner reappears and GA4 does not load
    cy.visit("/");
    cy.contains("We use analytics cookies").should("be.visible");
    cy.wait(1500);
    cy.get("script#ga4-script").should("not.exist");
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
    cy.get('button[aria-label="Decline analytics cookies"]')
      .should("be.visible")
      .and("not.have.attr", "tabindex", "-1");
  });

  it("privacy policy link is visible and has an href", () => {
    cy.contains("a", "Privacy policy")
      .should("be.visible")
      .and("have.attr", "href");
  });
});
