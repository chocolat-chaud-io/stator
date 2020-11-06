import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

import { AppModule } from "./app/app.module"

async function bootstrap() {
  const globalPrefix = "api"
  const fastifyOptions = { logger: true }

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastifyOptions))
  app.useGlobalPipes(new ValidationPipe())
  app.enableShutdownHooks()
  app.enableCors({ origin: "*" })
  app.setGlobalPrefix(globalPrefix)

  const swaggerOptions = new DocumentBuilder()
    .setTitle("Todos")
    .setDescription("The todos API description")
    .setVersion("1.0")
    .addTag("todos")
    .build()

  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup("documentation", app, document)

  const configService = app.get(ConfigService)
  await app.listen(configService.get<number>("port"), configService.get<string>("address"))
}

bootstrap()
