/**
 * Homepage content tests.
 *
 * Tests the actual rendered content of the default English route (`/`).
 * Grounded in what en.json currently defines — update alongside copy changes.
 */
describe("Homepage content", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("has the correct document title", () => {
    cy.title().should("eq", "Chayn Reports");
  });

  it("renders a single h1 with the report heading", () => {
    cy.get("h1")
      .should("have.length", 1)
      .and("contain.text", "Chayn Impact Report");
  });

  it("renders the intro paragraph", () => {
    cy.get("main p").should(
      "contain.text",
      "Welcome to Chayn's impact report.",
    );
  });
});
