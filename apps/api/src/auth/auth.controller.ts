/*import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      const user = await this.authService.validateUser(
        dto.email,
        dto.password,
        dto.churchId, // ✅ important
      );

      return this.authService.login(user);
    } catch (err: any) {
      console.error('Login error:', err.message);
      throw new UnauthorizedException(err.message || 'Erreur de connexion');
    }
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (err: any) {
      console.error('Register error:', err.message);
      throw new UnauthorizedException(
        err.message || "Erreur lors de l'inscription",
      );
    }
  }
}*/

// apps/api/src/auth/auth.controller.ts
// apps/api/src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
//import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-smart')
  async loginSmart(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    const user = await this.authService.validateUserSmart(email, password);

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable ou non lié à une église');
    }

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (err: any) {
      console.error('Register error:', err.message);
      throw new UnauthorizedException(
        err.message || "Erreur lors de l'inscription",
      );
    }
  }
}
