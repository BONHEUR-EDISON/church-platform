// apps/api/src/sermon/sermon.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { SermonService } from './sermon.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sermons')
export class SermonController {
  constructor(private sermonService: SermonService) {}

  // ⚡ Crée le dossier uploads s'il n'existe pas
  private ensureUploadsDir(): string {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('Dossier uploads créé:', uploadPath);
    }
    return uploadPath;
  }

  // ➕ Créer une prédication (upload ou URL)
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, path.join(__dirname, '../../uploads'));
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      title: string;
      description?: string;
      type: 'AUDIO' | 'VIDEO';
      url?: string;
    },
  ) {
    try {
      // ✅ Validation : au moins un fichier ou une URL
      const finalUrl = file ? `/uploads/${file.filename}` : body.url;
      if (!finalUrl)
        throw new BadRequestException(
          'Vous devez fournir un fichier ou une URL',
        );

      return await this.sermonService.create(
        req.user.churchId,
        body.title,
        finalUrl,
        body.type,
        body.description,
      );
    } catch (err) {
      console.error('Erreur create sermon:', err);
      throw new InternalServerErrorException(
        'Impossible de créer la prédication',
      );
    }
  }

  // 📄 Lister toutes les prédications
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    if (!req.user?.churchId) throw new ForbiddenException('churchId manquant');
    return this.sermonService.findAllByChurch(req.user.churchId);
  }

  // 🔍 Récupérer une prédication sécurisée
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.sermonService.findOneSecure(id, req.user.churchId);
  }

  // ✏️ Mettre à jour une prédication (upload ou URL)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, path.join(__dirname, '../../uploads'));
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const finalUrl = file ? `/uploads/${file.filename}` : body.url;
    if (!finalUrl)
      throw new BadRequestException('Vous devez fournir un fichier ou une URL');

    return this.sermonService.updateSecure(id, req.user.churchId, {
      ...body,
      url: finalUrl,
    });
  }

  // 🗑 Supprimer une prédication sécurisée
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.sermonService.removeSecure(id, req.user.churchId);
  }
}
