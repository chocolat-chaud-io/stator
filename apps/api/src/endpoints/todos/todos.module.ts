import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Todo } from "@stator/models"

import { TodosController } from "./todos.controller"
import { TodosService } from "../../services/todos.service"
import { TodosServiceModule } from "../../services/todos-service.module";

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), TodosServiceModule],
  providers: [TodosService],
  exports: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
