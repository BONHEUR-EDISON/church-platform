// src/church/church.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateChurchDto } from './dto/create-church.dto';
//import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateChurchWithAdminDto } from './dto/create-church-with-admin.dto';

@Injectable()
export class ChurchService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  /**
   * Crée uniquement une église (utilisé par POST /church)
   */
  async createChurch(dto: CreateChurchDto) {
    const church = await this.prisma.church.create({
      data: {
        name: dto.name,
        address: dto.address,
        pastorName: dto.pastorName,
        agreementNo: dto.agreementNo ?? null,
        foundedAt: new Date(dto.foundedAt),
        country: dto.country,
        city: dto.city,
      },
    });

    // 🔹 On ne crée pas l’admin ici, juste renvoyer l’ID
    return { id: church.id, name: church.name };
  }

  /**
   * Crée une église + admin, puis retourne un JWT (utilisé par POST /church/create)
   */
  async createChurchWithAdmin(dto: CreateChurchWithAdminDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Création église
      const church = await tx.church.create({
        data: {
          name: dto.church.name,
          address: dto.church.address,
          pastorName: dto.church.pastorName,
          agreementNo: dto.church.agreementNo ?? null,
          foundedAt: new Date(dto.church.foundedAt),
          country: dto.church.country,
          city: dto.church.city,
        },
      });

      // 2️⃣ Récupérer le rôle ADMIN
      const role = await tx.role.findUnique({
        where: { name: 'ADMIN' },
      });

      if (!role) {
        throw new Error('Le rôle ADMIN est absent dans la table Role');
      }

      // 3️⃣ Création admin + assignation rôle
      const hashed = await bcrypt.hash(dto.admin.password, 10);

      const admin = await tx.user.create({
        data: {
          email: dto.admin.email,
          password: hashed,
          churchId: church.id,
          roles: {
            create: {
              roleId: role.id,
            },
          },
        },
        include: { roles: { include: { role: true } } },
      });

      // 4️⃣ Génération JWT
      const payload = {
        sub: admin.id,
        churchId: church.id,
        roles: admin.roles.map((r) => r.role.name),
      };

      const token = this.jwt.sign(payload);

      return {
        access_token: token,
        roles: payload.roles,
        churchId: church.id,
      };
    });
  }
  /**
   * Liste toutes les églises
   */
  async getChurches() {
    return this.prisma.church.findMany();
  }
}

/*
// src/church/church.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateChurchDto {
  name: string;
  address: string;
  pastorName: string;
  agreementNo: string;
  foundedAt: Date;
  country: string;
  city: string;
}

@Injectable()
export class ChurchService {
  constructor(private prisma: PrismaService) {}

  // Méthode pour créer une église
  async createChurch(dto: CreateChurchDto) {
    return this.prisma.church.create({
      data: {
        name: dto.name,
        address: dto.address,
        pastorName: dto.pastorName,
        agreementNo: dto.agreementNo,
        foundedAt: dto.foundedAt,
        country: dto.country,
        city: dto.city,
      },
    });
  }

  // <- Ajoute cette méthode pour lister toutes les églises
  async getChurches() {
    return this.prisma.church.findMany(); // récupère toutes les églises
  }

  // Tu peux ajouter d'autres méthodes selon besoin
}
*/
