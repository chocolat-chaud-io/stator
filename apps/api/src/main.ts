import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

import { AppModule } from "./app/app.module"
import { environment } from "./environments/environment"

const productionLogs: ["log", "warn", "error"] = ["log", "warn", "error"]
const debugLogs: ["debug", "verbose"] = ["debug", "verbose"]

async function bootstrap() {
  const globalPrefix = "api"
  const fastifyOptions = { logger: true }

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastifyOptions), {
    logger: environment.production ? productionLogs : [...productionLogs, ...debugLogs],
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableShutdownHooks()
  app.enableCors({ origin: "*" })
  app.setGlobalPrefix(globalPrefix)

  const swaggerOptions = new DocumentBuilder()
    .setTitle("Stator")
    .setDescription("The stator API description")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup("documentation", app, document)

  const configService = app.get(ConfigService)
  app.listen(configService.get<number>("port"), configService.get<string>("address")).catch(error => console.error(error))
}

bootstrap().catch(console.error)
