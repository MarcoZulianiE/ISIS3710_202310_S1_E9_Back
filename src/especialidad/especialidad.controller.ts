import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EspecialidadDto } from './especialidad.dto';
import { EspecialidadEntity } from './especialidad.entity';
import { EspecialidadService } from './especialidad.service';

@Controller('especialidad')
@UseInterceptors(BusinessErrorsInterceptor)
export class EspecialidadController {
    constructor(private readonly especialidadService: EspecialidadService) {}

    @Get()
    async findAll() {
      return await this.especialidadService.findAll();
    }
  
    @Get(':especialidadId')
    async findOne(@Param('especialidadId') especialidadId: string) {
      return await this.especialidadService.findOne(especialidadId);
    }
  
    @Post()
    async create(@Body() especialidadDto: EspecialidadDto) {
      const necesidad: EspecialidadEntity = plainToInstance(EspecialidadEntity, especialidadDto);
      return await this.especialidadService.create(necesidad);
    }
  
    @Put(':especialidadId')
    async update(@Param('especialidadId') especialidadId: string, @Body() especialidadDto: EspecialidadDto) {
      const necesidad: EspecialidadEntity = plainToInstance(EspecialidadEntity, especialidadDto);
      return await this.especialidadService.update(especialidadId, necesidad);
    }
  
    @Delete(':especialidadId')
    @HttpCode(204)
    async delete(@Param('especialidadId') especialidadId: string) {
      return await this.especialidadService.delete(especialidadId);
    }
}
