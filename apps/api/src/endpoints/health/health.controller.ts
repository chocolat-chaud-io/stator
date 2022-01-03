import { Controller, Get } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";

import { environment } from "../../environments/environment"

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private health: HealthCheckService, private dns: HttpHealthIndicator) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: "Health Check" })
  check() {
    return this.health.check([() => this.dns.pingCheck("api", environment.apiUrl)])
  }
}
