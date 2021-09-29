import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Todo } from "@stator/models"

import { TodosServiceModule } from "../../services/todos-service.module"
import { TodosService } from "../../services/todos.service"
import { TodosController } from "./todos.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), TodosServiceModule],
  providers: [TodosService],
  exports: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
