/*import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('admin')
  @Roles('ADMIN')
  async getAdminDashboard(@Req() req) {
    if (!req.user?.churchId) {
      throw new Error('churchId manquant dans le token JWT'); // Pour debug
    }
    return this.dashboardService.getAdminStats(req.user.churchId);
  }
}
*/

// apps/api/src/dashboard/dashboard.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** Route unique pour récupérer les stats selon le rôle */
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Req() req: any) {
    const user = req.user;
    const role = user.roles?.[0]?.toUpperCase(); // premier rôle
    const churchId = user.churchId;

    if (!churchId) throw new Error('Utilisateur non lié à une église');

    switch (role) {
      case 'ADMIN':
        return this.dashboardService.getAdminStats(churchId);
      case 'PASTOR':
      case 'MEMBER':
      default:
        return this.dashboardService.getBasicStats(churchId);
    }
  }

  /** Anciennes routes (facultatives, pour compatibilité) */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async getAdminDashboard(@Req() req: any) {
    return this.dashboardService.getAdminStats(req.user.churchId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('basic')
  async getBasicDashboard(@Req() req: any) {
    return this.dashboardService.getBasicStats(req.user.churchId);
  }
}
