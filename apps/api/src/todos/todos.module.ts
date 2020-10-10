import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TodosService } from "./todos.service";
import { TodosController } from "./todos.controller";
import { Todo } from "./todo.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodosService],
  exports: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
