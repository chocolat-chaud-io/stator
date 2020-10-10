import { Module } from "@nestjs/common"
import { TodosModule } from "../todos/todos.module"
import { ServeStaticModule } from "@nestjs/serve-static"
import { configuration } from "../config/configuration";
import { getRootModuleImports } from "../utils";

@Module({
  imports: [
    ...getRootModuleImports(configuration),
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/assets`,
      exclude: ["/api*"],
    }),
    TodosModule,
  ],
  controllers: [],
  providers: [],
})


export class AppModule {}
