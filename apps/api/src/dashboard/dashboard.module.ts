// src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule, // pour JwtService et guards
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretkey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService, AdminGuard],
  exports: [AdminGuard],
})
export class DashboardModule {}
