// apps/api/src/dashboard/dashboard.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /** Statistiques Admin par église */
  async getAdminStats(churchId: string) {
    const church = await this.prisma.church.findUnique({
      where: { id: churchId },
    });

    if (!church) throw new NotFoundException('Église introuvable');

    // Nombre de membres
    const membersCount = await this.prisma.member.count({ where: { churchId } });

    // Nombre d'utilisateurs par rôle
    const usersByRoleRaw = await this.prisma.userRole.groupBy({
      by: ['roleId'],
      where: { user: { churchId } },
      _count: { roleId: true },
    });

    const roleIds = usersByRoleRaw.map((r) => r.roleId);
    const roles = await this.prisma.role.findMany({ where: { id: { in: roleIds } } });

    const usersByRole = usersByRoleRaw.map((item) => ({
      role: roles.find((r) => r.id === item.roleId)?.name || 'UNKNOWN',
      count: item._count.roleId,
    }));

    // Exemple de statistiques d’activité mensuelle pour les graphiques
    const activity = Array.from({ length: 12 }).map((_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      value: Math.floor(Math.random() * 20 + 5), // mock data, à remplacer par vos données réelles
    }));

    return {
      church: {
        name: church.name,
        pastor: church.pastorName,
        createdAt: church.createdAt,
      },
      stats: {
        members: membersCount,
        usersByRole,
        activity,
      },
    };
  }

  /** Statistiques globales pour Pastor ou Member */
  async getBasicStats(churchId: string) {
    const membersCount = await this.prisma.member.count({ where: { churchId } });
    const usersCount = await this.prisma.user.count({ where: { churchId } });

    // Activité mensuelle (mock)
    const activity = Array.from({ length: 12 }).map((_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      value: Math.floor(Math.random() * 15 + 1),
    }));

    return {
      stats: {
        members: membersCount,
        users: usersCount,
        activity,
      },
    };
  }
}
