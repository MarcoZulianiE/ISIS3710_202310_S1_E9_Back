import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { OfertaDto } from './oferta.dto';
import { OfertaEntity } from './oferta.entity';
import { OfertaService } from './oferta.service';

@Controller('ofertas')
@UseInterceptors(BusinessErrorsInterceptor)
export class OfertaController {
    constructor(private readonly ofertaService: OfertaService) {}

    @Get()
    async findAll() {
        return await this.ofertaService.findAll();
    }

    @Get(':ofertaId')
    async findOne(@Param('ofertaId') ofertaId: string) {
        return await this.ofertaService.findOne(ofertaId);
    }

    @Post()
    async create(@Body() ofertaDto: OfertaDto) {
        const oferta: OfertaEntity = plainToInstance(OfertaEntity, ofertaDto)
        return await this.ofertaService.create(oferta);
    }

    @Put(':ofertaId')
    async update(@Param('ofertaId') ofertaId: string, @Body() ofertaDto: OfertaDto) {
        const oferta: OfertaEntity = plainToInstance(OfertaEntity, ofertaDto)
        return await this.ofertaService.update(ofertaId, oferta);
    }

    @Delete(':ofertaId')
    @HttpCode(204)
    async delete(@Param('ofertaId') ofertaId: string) {
        await this.ofertaService.delete(ofertaId);
    }
}
