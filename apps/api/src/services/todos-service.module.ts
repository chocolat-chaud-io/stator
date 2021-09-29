import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Todo } from "@stator/models"

import { TodosService } from "./todos.service"

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodosService],
  exports: [TodosService],
  controllers: [],
})
export class TodosServiceModule {}
