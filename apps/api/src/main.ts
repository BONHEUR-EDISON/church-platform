// apps/api/src/main.ts
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import * as fs from 'fs';

async function bootstrap() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);

  // Définit /api/* pour correspondre au baseURL du frontend
  app.setGlobalPrefix('api');

  // Active CORS pour le frontend
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  // Active la validation globale
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // ⚡ Chemin absolu du dossier uploads
  const uploadsDir = join(__dirname, '..', 'uploads');

  // Crée le dossier uploads s'il n'existe pas
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Dossier uploads créé :', uploadsDir);
  }

  // Sert les fichiers statiques depuis /uploads
  app.use('/uploads', express.static(uploadsDir));

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`);
}

bootstrap();
