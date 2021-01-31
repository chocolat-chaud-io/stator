import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Todo } from "@stator/models"
import { RedisCacheModule } from '../cache/redisCache.module'

import { TodosController } from "./todos.controller"
import { TodosService } from "./todos.service"

@Module({
  imports: [TypeOrmModule.forFeature([Todo]),
  RedisCacheModule],
  providers: [TodosService],
  exports: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
