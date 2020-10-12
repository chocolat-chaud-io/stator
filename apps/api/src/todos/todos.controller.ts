import { Controller } from "@nestjs/common"
import { Crud, CrudController } from "@nestjsx/crud"
import { Todo } from "@stator/models"

import { TodosService } from "./todos.service"

@Crud({ model: { type: Todo } })
@Controller("todos")
export class TodosController implements CrudController<Todo> {
  constructor(public service: TodosService) {}
}
