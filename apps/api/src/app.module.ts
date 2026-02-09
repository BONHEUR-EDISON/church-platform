// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { RolesGuard } from './auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ChurchModule } from './church/church.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RolesService } from './roles/roles.service';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { SermonModule } from './sermon/sermon.module';

@Module({
  imports: [
    AuthModule,
    ChurchModule,
    DashboardModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RolesModule,
    SermonModule,
  ],
  providers: [
    PrismaService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: RolesGuard },
    RolesService,
  ],
  controllers: [RolesController],
})
export class AppModule {}
