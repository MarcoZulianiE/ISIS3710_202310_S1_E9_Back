/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReseniaDto } from './resenia.dto';
import { ReseniaEntity } from './resenia.entity';
import { ReseniaService } from './resenia.service';

@UseInterceptors(BusinessErrorsInterceptor)

@Controller('resenias')
export class ReseniaController {
    constructor(private readonly reseniaService: ReseniaService) {}

    @Get()
    async findAll() {
        return await this.reseniaService.findAll();
    }

    @Get(':reseniaId')
    async findOne(@Param('reseniaId') reseniaId: string) {
        return await this.reseniaService.findOne(reseniaId);
    }

    @Post()
    async create(@Body() reseniaDto: ReseniaDto) {
        const resenia: ReseniaEntity = plainToInstance(ReseniaEntity, reseniaDto);
        return await this.reseniaService.create(resenia);
    }

    @Put(':reseniaId')
    async update(@Param('reseniaId') reseniaId: string, @Body() reseniaDto: ReseniaDto) {
        const resenia: ReseniaEntity = plainToInstance(ReseniaEntity, reseniaDto);
        return await this.reseniaService.update(reseniaId, resenia);
    }

    @Delete(':reseniaId')
    @HttpCode(204)
    async delete(@Param('reseniaId') reseniaId: string) {
        return await this.reseniaService.delete(reseniaId);
    }
}