import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm"
import { Todo } from "@stator/models"
import { Repository } from "typeorm"

@Injectable()
export class TodosService extends TypeOrmCrudService<Todo> {
  constructor(@InjectRepository(Todo) repository: Repository<Todo>) {
    super(repository)
  }
}
