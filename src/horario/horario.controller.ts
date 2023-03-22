import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { HorarioDto } from './horario.dto';
import { HorarioEntity } from './horario.entity';
import { HorarioService } from './horario.service';

@Controller('horarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class HorarioController {
    constructor(private readonly horarioService: HorarioService) {}

    
    @Get()
    async findAll() {
        return await this.horarioService.findAll();
    }

    @Get(':horarioId')
    async findOne(@Param('horarioId') horarioId: string) {
        return await this.horarioService.findOne(horarioId);
    }

    
    @Post()
    async create(@Body() horarioDto: HorarioDto) {
        const horario: HorarioEntity = plainToInstance(HorarioEntity, horarioDto)
        return await this.horarioService.create(horario);
    }

    @Put(':horarioId')
    async update(@Param('horarioId') horarioId: string, @Body() horarioDto: HorarioDto) {
        const horario: HorarioEntity = plainToInstance(HorarioEntity, horarioDto)
        return await this.horarioService.update(horarioId, horario);
    }

    @Delete(':horarioId')
    @HttpCode(204)
    async delete(@Param('horarioId') horarioId: string) {
        await this.horarioService.delete(horarioId);
    }
}
