import { ConfigModule, ConfigService } from "@nestjs/config"
import { ConfigFactory } from "@nestjs/config/dist/interfaces"
import { TypeOrmModule } from "@nestjs/typeorm"

import { getOrmConfigFn } from "./config/configuration"

export const getRootModuleImports = (configuration: ConfigFactory) => [
  ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: getOrmConfigFn,
  }),
]
