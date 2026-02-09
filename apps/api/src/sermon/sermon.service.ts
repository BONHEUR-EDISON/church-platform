import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SermonService {
  constructor(private prisma: PrismaService) {}

  async create(
    churchId: string,
    title: string,
    url: string,
    type: 'AUDIO' | 'VIDEO',
    description?: string,
  ) {
    return this.prisma.sermon.create({
      data: { title, description, type, url, churchId },
    });
  }

  async findAllByChurch(churchId: string) {
    return this.prisma.sermon.findMany({
      where: { churchId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneSecure(id: string, churchId: string) {
    const sermon = await this.prisma.sermon.findUnique({ where: { id } });
    if (!sermon) throw new NotFoundException('Prédication introuvable');
    if (sermon.churchId !== churchId)
      throw new ForbiddenException('Accès interdit');
    return sermon;
  }

  async updateSecure(
    id: string,
    churchId: string,
    data: Partial<{
      title: string;
      description: string;
      url: string;
      type: 'AUDIO' | 'VIDEO';
    }>,
  ) {
    await this.findOneSecure(id, churchId);
    return this.prisma.sermon.update({ where: { id }, data });
  }

  async removeSecure(id: string, churchId: string) {
    await this.findOneSecure(id, churchId);
    return this.prisma.sermon.delete({ where: { id } });
  }
}
