import { Controller } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { Crud, CrudController } from "@nestjsx/crud"
import { Todo } from "@stator/models"

import { TodosService } from "../../services/todos.service"

@ApiTags("todos")
@Controller("todos")
@Crud({
  model: { type: Todo },
  routes: {
    exclude: ["createManyBase", "getOneBase", "replaceOneBase"],
    getManyBase: { decorators: [ApiOperation({ operationId: "getManyTodos", summary: "Retrieve multiple Todos" })] },
    createOneBase: { decorators: [ApiOperation({ operationId: "createOneTodo", summary: "Create one Todo" })] },
    updateOneBase: { decorators: [ApiOperation({ operationId: "updateOneTodo", summary: "Update a single todo" })] },
    deleteOneBase: { decorators: [ApiOperation({ operationId: "deleteOneTodo", summary: "Delete a single todo" })] },
  },
})
export class TodosController implements CrudController<Todo> {
  constructor(public service: TodosService) {}
}
