// src/auth/guards/admin-dashboard.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Token manquant');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token manquant');

    try {
      const decoded: any = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      });

      // Vérifie le rôle
      if (!decoded.roles || !decoded.roles.includes('ADMIN')) {
        throw new ForbiddenException('Ressource interdite');
      }

      // Vérifie le churchId
      if (!decoded.churchId) {
        throw new ForbiddenException('churchId manquant dans le token');
      }

      // Attache les infos de l'utilisateur à la requête
      (request as any).user = decoded;

      return true;
    } catch (err: any) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
