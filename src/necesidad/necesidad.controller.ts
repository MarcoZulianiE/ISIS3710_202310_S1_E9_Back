import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NecesidadDto } from './necesidad.dto';
import { NecesidadEntity } from './necesidad.entity';
import { NecesidadService } from './necesidad.service';

@Controller('necesidad')
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

  @Post()
  async create(@Body() necesidadDto: NecesidadDto) {
    const necesidad: NecesidadEntity = plainToInstance(NecesidadEntity, necesidadDto);
    return await this.necesidadService.create(necesidad);
  }

  @Put(':necesidadId')
  async update(@Param('necesidadId') necesidadId: string, @Body() necesidadDto: NecesidadDto) {
    const necesidad: NecesidadEntity = plainToInstance(NecesidadEntity, necesidadDto);
    return await this.necesidadService.update(necesidadId, necesidad);
  }

  @Delete(':necesidadId')
  @HttpCode(204)
  async delete(@Param('necesidadId') necesidadId: string) {
    return await this.necesidadService.delete(necesidadId);
  }
}
