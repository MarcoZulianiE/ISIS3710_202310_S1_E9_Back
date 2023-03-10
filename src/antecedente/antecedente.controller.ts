/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AntecedenteDto } from './antecedente.dto';
import { AntecedenteEntity } from './antecedente.entity';
import { AntecedenteService } from './antecedente.service';

@Controller('antecedentes')
@UseInterceptors(BusinessErrorsInterceptor)
export class AntecedenteController {
    constructor(private readonly antecedenteService: AntecedenteService) {}

    @Get()
    async findAll() {
        return await this.antecedenteService.findAll();
    }

    @Get(':antecedenteId')
    async findOne(@Param('antecedenteId') antecedenteId: string) {
        return await this.antecedenteService.findOne(antecedenteId);
    }

    @Post()
    async create(@Body() antecedenteDto: AntecedenteDto) {
        const antecedente: AntecedenteEntity = plainToInstance(AntecedenteEntity, antecedenteDto);
        return await this.antecedenteService.create(antecedente);
    }

    @Put(':antecedenteId')
    async update(@Param('antecedenteId') antecedenteId: string, @Body() antecedenteDto: AntecedenteDto) {
        const antecedente: AntecedenteEntity = plainToInstance(AntecedenteEntity, antecedenteDto);
        return await this.antecedenteService.update(antecedenteId, antecedente);
    }

    @Delete(':antecedenteId')
    @HttpCode(204)
    async delete(@Param('antecedenteId') antecedenteId: string) {
        return await this.antecedenteService.delete(antecedenteId);
    }
}
