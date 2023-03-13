import { Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { HorarioOfertaService } from './horario-oferta.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('horarios')
export class HorarioOfertaController {
    constructor(private readonly horarioOfertaService: HorarioOfertaService) {}

    @Post(':horarioId/ofertas/:ofertaId')
    async addOfertaHorario(@Param('horarioId') horarioId: string, @Param('ofertaId') ofertaId: string) {
        return await this.horarioOfertaService.addOfertaHorario(horarioId, ofertaId);
    }

    @Get(':horarioId/ofertas/:ofertaId')
    async findOfertaByHorarioIdOfertaId(@Param('horarioId') horarioId: string, @Param('ofertaId') ofertaId: string) {
        return await this.horarioOfertaService.findOfertaByHorarioIdOfertaId(horarioId, ofertaId);
    }

    @Get(':horarioId/ofertas')
    async findOfertasByHorarioId(@Param('horarioId') horarioId: string) {
        return await this.horarioOfertaService.findOfertasByHorarioId(horarioId);
    }

    // @Put(':horarioId/ofertas')
    // async associateOfertasHorario(@Body() ofertasDto: OfertaDto[], @Param('horarioId') horarioId: string) {
    //     // TODO: ASK about put with just one item
    //     // const ofertas: OfertaEntity = plainToInstance(OfertaEntity, ofertasDto)
    //     // return await this.horarioOfertaService.associateOfertaHorario(horarioId, ofertas);
    // }

    @Delete(':horarioId/ofertas/:ofertaId')
    @HttpCode(204)
    async deleteOfertaHorario(@Param('horarioId') horarioId: string, @Param('ofertaId') ofertaId: string) {
        await this.horarioOfertaService.deleteOfertaHorario(horarioId, ofertaId);
    }
    
}
