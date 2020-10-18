import { Controller, Get } from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"
import { DNSHealthIndicator, HealthCheck, HealthCheckService } from "@nestjs/terminus"

import { environment } from "../environments/environment"

@Controller("health")
export class HealthController {
  constructor(private health: HealthCheckService, private dns: DNSHealthIndicator) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: "Health Check" })
  check() {
    return this.health.check([() => this.dns.pingCheck("api", environment.apiUrl)])
  }
}
