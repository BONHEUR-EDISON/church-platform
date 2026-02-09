import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // Connexion intelligente : email + password
  async validateUserSmart(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { roles: { include: { role: true } }, church: true },
    });

    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Mot de passe incorrect');

    if (!user.church)
      throw new UnauthorizedException('Utilisateur non lié à une église');

    return user;
  }

  // Génère JWT + infos utilisateur
  async login(user: any) {
    const roles = user.roles.map((r) => r.role?.name).filter(Boolean);

    const payload = {
      sub: user.id,
      churchId: user.churchId,
      roles,
      iss: 'church-platform',
      aud: 'church-app',
    };

    return {
      access_token: this.jwt.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        churchId: user.churchId,
        roles,
      },
    };
  }

  /**
   * Inscription utilisateur
   * ➜ Création ADMIN automatique
   * ➜ Création Member liée
   */
  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.findUnique({
        where: { name: 'ADMIN' },
      });

      if (!role) {
        throw new BadRequestException('Rôle ADMIN introuvable');
      }

      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashed,
          churchId: dto.churchId,
          roles: {
            create: {
              roleId: role.id,
            },
          },
        },
        include: {
          roles: { include: { role: true } },
        },
      });

      if (dto.name) {
        const parts = dto.name.trim().split(/\s+/);

        await tx.member.create({
          data: {
            firstName: parts.shift() || '',
            lastName: parts.join(' ') || '',
            email: dto.email,
            churchId: dto.churchId,
          },
        });
      }

      return this.login(user);
    });
  }
}
