import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ContratoDto } from './contrato.dto';
import { ContratoEntity } from './contrato.entity';
import { ContratoService } from './contrato.service';

@Controller('contratos')
export class ContratoController {

    constructor(private readonly contratoService: ContratoService) {}

    @Get()
    async findAll() {
        return await this.contratoService.findAll();
    }

    @Get(':contratoId')
    async findOne(@Param('contratoId') contratoId: string) {
        return await this.contratoService.findOne(contratoId);
    }

    @Post()
    async create(@Body() contratoDto: ContratoDto) {
        const contrato: ContratoEntity = plainToInstance(ContratoEntity, contratoDto)
        return await this.contratoService.create(contrato);
    }

    @Put(':contratoId')
    async update(@Param('contratoId') contratoId: string, @Body() contratoDto: ContratoDto) {
        const contrato: ContratoEntity = plainToInstance(ContratoEntity, contratoDto)
        return await this.contratoService.update(contratoId, contrato);
    }

    @Delete(':contratoId')
    @HttpCode(204)
    async delete(@Param('contratoId') contratoId: string) {
        await this.contratoService.delete(contratoId);
    }



}
