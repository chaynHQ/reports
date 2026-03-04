import "./commands";

if (Cypress.env("VERCEL_BYPASS_SECRET")) {
  beforeEach(() => {
    cy.intercept("**", (req) => {
      req.headers["x-vercel-protection-bypass"] = Cypress.env(
        "VERCEL_BYPASS_SECRET",
      );
    });
  });
}
