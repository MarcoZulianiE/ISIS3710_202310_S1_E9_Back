import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/shared/security/roles';
import { HasRoles } from 'src/shared/security/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EspecialidadDto } from './especialidad.dto';
import { EspecialidadEntity } from './especialidad.entity';
import { EspecialidadService } from './especialidad.service';

@Controller('especialidades')
@UseInterceptors(BusinessErrorsInterceptor)
export class EspecialidadController {
    constructor(private readonly especialidadService: EspecialidadService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.LECTORESPECIALIDAD, Role.ADMIN)
    @Get()
    async findAll() {
      return await this.especialidadService.findAll();
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.LECTORESPECIALIDAD, Role.ADMIN)
    @Get(':especialidadId')
    async findOne(@Param('especialidadId') especialidadId: string) {
      return await this.especialidadService.findOne(especialidadId);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ESCRITORESPECIALIDAD, Role.ADMIN)
    @Post()
    async create(@Body() especialidadDto: EspecialidadDto) {
      const necesidad: EspecialidadEntity = plainToInstance(EspecialidadEntity, especialidadDto);
      return await this.especialidadService.create(necesidad);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ESCRITORESPECIALIDAD, Role.ADMIN)
    @Put(':especialidadId')
    async update(@Param('especialidadId') especialidadId: string, @Body() especialidadDto: EspecialidadDto) {
      const necesidad: EspecialidadEntity = plainToInstance(EspecialidadEntity, especialidadDto);
      return await this.especialidadService.update(especialidadId, necesidad);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ESCRITORESPECIALIDAD, Role.ADMIN)
    @Delete(':especialidadId')
    @HttpCode(204)
    async delete(@Param('especialidadId') especialidadId: string) {
      return await this.especialidadService.delete(especialidadId);
    }
}
