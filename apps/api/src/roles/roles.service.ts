import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  // Création rôle
  async create(dto: CreateRoleDto) {
    if (!dto.name || dto.name.trim() === '') {
      throw new BadRequestException('Le nom du rôle est obligatoire');
    }

    const exist = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });

    if (exist) {
      throw new BadRequestException('Ce rôle existe déjà');
    }

    return this.prisma.role.create({
      data: { name: dto.name },
    });
  }
  // Liste des rôles
  findAll() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Attribution rôle → utilisateur
  async assign(dto: AssignRoleDto) {
    return this.prisma.userRole.create({
      data: {
        userId: dto.userId,
        roleId: dto.roleId,
      },
    });
  }

  // Rôles d’un utilisateur
  getUserRoles(userId: string) {
    return this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
  }
}
