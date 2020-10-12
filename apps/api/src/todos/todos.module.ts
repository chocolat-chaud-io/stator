import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Todo } from "@stator/models"

import { TodosController } from "./todos.controller"
import { TodosService } from "./todos.service"

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodosService],
  exports: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
