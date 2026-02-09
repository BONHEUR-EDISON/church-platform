/*import { Controller, Post, Body } from '@nestjs/common';
import { ChurchService } from './church.service';
import { CreateChurchWithAdminDto } from './dto/create-church-with-admin.dto';

@Controller('church')
export class ChurchController {
  constructor(private churchService: ChurchService) {}

  @Post('create')
  async createChurch(@Body() dto: CreateChurchWithAdminDto) {
    return this.churchService.createChurchWithAdmin(dto);
  }
}


// src/church/church.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChurchService } from './church.service';
import { CreateChurchDto } from './dto/create-church.dto';

@Controller('church')
export class ChurchController {
  constructor(private churchService: ChurchService) {}

  @Post()
  create(@Body() dto: CreateChurchDto) {
    return this.churchService.createChurch(dto);
  }

  @Get()
  findAll() {
    return this.churchService.getChurches();
  }
}*/
// src/church/church.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChurchService } from './church.service';
import { CreateChurchDto } from './dto/create-church.dto';
import { CreateChurchWithAdminDto } from './dto/create-church-with-admin.dto';

@Controller('church')
export class ChurchController {
  constructor(private churchService: ChurchService) {}

  @Get('ping')
  ping() {
    return { message: 'pong' };
  }

  // POST /church    <- utilisé par le frontend CreateChurch.tsx
  @Post()
  create(@Body() dto: CreateChurchDto) {
    return this.churchService.createChurch(dto);
  }

  // POST /church/create <- création église + admin (si vous voulez garder ce flow)
  @Post('create')
  async createChurch(@Body() dto: CreateChurchWithAdminDto) {
    return this.churchService.createChurchWithAdmin(dto);
  }
}
