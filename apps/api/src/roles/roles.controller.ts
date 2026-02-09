import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Post('assign')
  assign(@Body() dto: AssignRoleDto) {
    return this.rolesService.assign(dto);
  }

  @Get('user/:id')
  getUserRoles(@Param('id') id: string) {
    return this.rolesService.getUserRoles(id);
  }
}
