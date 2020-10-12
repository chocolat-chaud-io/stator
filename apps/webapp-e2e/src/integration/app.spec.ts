describe("webapp", () => {
  const newTodoText = "Brand new todo"
  const todoTextSelector = "[data-testid='todo-text'] span"

  beforeEach(() => {
    cy.visit("/")

    cy.server()
    cy.route("**/todos").as("getTodos")

    cy.wait("@getTodos").then(xhr => {
      if (xhr.response.body.length > 0) {
        cy.get(".delete-icon-button").click({ multiple: true })
      }
    })
  })

  const createTodo = () => {
    cy.get("#create-text-field").type(`${newTodoText}{enter}`)
  }

  it("should create a todo", () => {
    createTodo()
    expect(cy.get(todoTextSelector).contains(newTodoText)).to.exist
  })

  it("should update a todo", () => {
    const updatedTodoText = "Update todo text"

    createTodo()

    cy.get(".edit-icon-button").click()

    cy.get("[data-testid='edit-text-field']").type(`${updatedTodoText}{enter}`)

    expect(cy.get(todoTextSelector).contains(updatedTodoText)).to.exist
  })

  it("should delete a todo", () => {
    createTodo()

    cy.get(".delete-icon-button").click()

    cy.get(todoTextSelector).should("not.exist")
  })
})
