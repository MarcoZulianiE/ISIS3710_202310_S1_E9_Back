import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/shared/security/roles';
import { HasRoles } from 'src/shared/security/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NecesidadDto } from './necesidad.dto';
import { NecesidadEntity } from './necesidad.entity';
import { NecesidadService } from './necesidad.service';

@Controller('necesidades')
@UseInterceptors(BusinessErrorsInterceptor)
export class NecesidadController {
    constructor(private readonly necesidadService: NecesidadService) {}


  @Get()
  async findAll() {
    return await this.necesidadService.findAll();
  }


  @Get(':necesidadId')
  async findOne(@Param('necesidadId') necesidadId: string) {
    return await this.necesidadService.findOne(necesidadId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
  @Post()
  async create(@Body() necesidadDto: NecesidadDto) {
    const necesidad: NecesidadEntity = plainToInstance(NecesidadEntity, necesidadDto);
    return await this.necesidadService.create(necesidad);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
  @Put(':necesidadId')
  async update(@Param('necesidadId') necesidadId: string, @Body() necesidadDto: NecesidadDto) {
    const necesidad: NecesidadEntity = plainToInstance(NecesidadEntity, necesidadDto);
    return await this.necesidadService.update(necesidadId, necesidad);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
  @Delete(':necesidadId')
  @HttpCode(204)
  async delete(@Param('necesidadId') necesidadId: string) {
    return await this.necesidadService.delete(necesidadId);
  }
}
