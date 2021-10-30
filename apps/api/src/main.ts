import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { WinstonModule } from "nest-winston"
import winston from "winston"

import { AppModule } from "./app/app.module"
import { getWinstonConsoleFormat } from "./utils/utils"

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }), {
    logger: WinstonModule.createLogger({ transports: [new winston.transports.Console({ format: getWinstonConsoleFormat() })] }),
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableShutdownHooks()
  app.enableCors({ origin: "*" })
  app.setGlobalPrefix("api")

  const swaggerOptions = new DocumentBuilder().setTitle("Stator").setDescription("The stator API description").setVersion("1.0").build()

  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup("documentation", app, document)

  const configService = app.get(ConfigService)
  app.listen(configService.get<number>("port"), configService.get<string>("address")).catch(error => console.error(error))
}

bootstrap().catch(console.error)
