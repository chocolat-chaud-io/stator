import { ConfigModule, ConfigService } from "@nestjs/config"
import { getOrmConfigFn } from "./config/configuration"
import { TypeOrmModule } from "@nestjs/typeorm"

export const getRootModuleImports = (configuration) => [
  ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: getOrmConfigFn,
  }),
]
