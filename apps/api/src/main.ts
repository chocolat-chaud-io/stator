import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger"
import { WinstonModule } from "nest-winston"
import winston from "winston"

import { AppModule } from "./app/app.module"
import { getWinstonConsoleFormat } from "./utils/utils"

function configureSwagger(app: NestFastifyApplication) {
  const swaggerConfig = new DocumentBuilder().setTitle("Stator").setDescription("The stator API description").setVersion("1.0").build()
  const swaggerOptions: SwaggerDocumentOptions = {
    // This basically has no effect because of this bug: https://github.com/nestjsx/crud/issues/759
    operationIdFactory: (controllerKey, methodKey) => {
      const entityName = `${methodKey.includes("Many") ? "" : "s"}Controller`

      return methodKey.includes("Base")
        ? `${methodKey.replace("Base", controllerKey.replace(entityName, ""))}`
        : `${methodKey}${entityName}`
    },
  }

  const document = SwaggerModule.createDocument(app, swaggerConfig, swaggerOptions)
  SwaggerModule.setup("documentation", app, document)
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }), {
    logger: WinstonModule.createLogger({ transports: [new winston.transports.Console({ format: getWinstonConsoleFormat() })] }),
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableShutdownHooks()
  app.enableCors({ origin: "*" })
  app.setGlobalPrefix("api")

  configureSwagger(app)

  const configService = app.get(ConfigService)
  app.listen(configService.get<number>("port"), configService.get<string>("address")).catch(error => console.error(error))
}

bootstrap().catch(console.error)
