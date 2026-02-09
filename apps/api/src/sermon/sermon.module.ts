import { Module } from '@nestjs/common';
import { SermonService } from './sermon.service';
import { SermonController } from './sermon.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [SermonController],
  providers: [SermonService, PrismaService],
})
export class SermonModule {}
