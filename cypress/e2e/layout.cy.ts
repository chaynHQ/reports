/**
 * Layout component tests — Nav and Footer.
 *
 * Tests the rendered output of the TopNav and Footer on the default English
 * route (`/`). Grounded in en.json copy — update alongside translation changes.
 */
describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders a header landmark with the correct aria-label", () => {
    cy.get('header[aria-label="Site header"]').should("exist");
  });

  it("renders the primary nav landmark", () => {
    cy.get('nav[aria-label="Primary navigation"]').should("exist");
  });

  it("renders the logo link with accessible label", () => {
    cy.get('a[aria-label="Chayn — go to homepage"]').should("exist");
  });

  it("renders the Go to Chayn CTA link", () => {
    cy.get('a[aria-label="Go to Chayn website (opens in a new tab)"]')
      .should("exist")
      .and("have.attr", "href", "https://www.chayn.co")
      .and("have.attr", "target", "_blank");
  });

  it("opens and closes the mobile menu", () => {
    cy.viewport("iphone-8");
    cy.get('button[aria-label="Open navigation menu"]').click();
    cy.get("#mobile-menu").should("be.visible");
    cy.get('button[aria-label="Close navigation menu"]').click();
    cy.get("#mobile-menu").should("not.be.visible");
  });
});

describe("Footer", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders a footer landmark with the correct aria-label", () => {
    cy.get('footer[aria-label="Site footer"]').should("exist");
  });

  it("renders the Chayn logo link in the footer", () => {
    cy.get('footer a[aria-label="Chayn — go to main website (opens in a new tab)"]')
      .should("exist")
      .and("have.attr", "href", "https://www.chayn.co");
  });

  it("renders the social media links list", () => {
    cy.get('ul[aria-label="Chayn on social media"]')
      .should("exist")
      .find("li")
      .should("have.length", 6);
  });

  it("renders the legal contact link as a mailto", () => {
    cy.get('footer a[href="mailto:team@chayn.co"]')
      .should("exist")
      .and("contain.text", "Contact");
  });

  it("renders external footer links with rel=noopener", () => {
    cy.get("footer a[target='_blank']").each(($el) => {
      cy.wrap($el).should("have.attr", "rel", "noopener noreferrer");
    });
  });
});
