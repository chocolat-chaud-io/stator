import { Controller } from "@nestjs/common"
import { Crud, CrudController } from "@nestjsx/crud"
import { Todo } from "@stator/models"

import { TodosService } from "../../services/todos.service"
import { ApiTags } from "@nestjs/swagger";

@ApiTags("todos")
@Controller("todos")
@Crud({ model: { type: Todo } })
export class TodosController implements CrudController<Todo> {
  constructor(public service: TodosService) {}
}
