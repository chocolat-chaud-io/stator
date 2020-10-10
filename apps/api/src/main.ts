import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app/app.module"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const globalPrefix = "api"
  const fastifyOptions = { logger: true }

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastifyOptions))
  app.setGlobalPrefix(globalPrefix)

  const configService = app.get(ConfigService)

  const swaggerOptions = new DocumentBuilder()
    .setTitle("Todos")
    .setDescription("The todos API description")
    .setVersion("1.0")
    .addTag("todos")
    .build()

  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup("documentation", app, document)

  await app.listen(configService.get<number>("port"))
}

bootstrap()
