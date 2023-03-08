import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HorarioDto } from 'src/horario/horario.dto';
import { HorarioEntity } from 'src/horario/horario.entity';
import { OfertaHorarioService } from './oferta-horario.service';

@Controller('ofertas')
export class OfertaHorarioController {
    constructor(private readonly ofertaHorarioService: OfertaHorarioService) {}

    @Post(':ofertaId/horarios/:horarioId')
    async addHorarioOferta(@Param('ofertaId') ofertaId: string, @Param('horarioId') horarioId: string) {
        return await this.ofertaHorarioService.addHorarioToOferta(ofertaId, horarioId);
    }

    @Get(':ofertaId/horarios/:horarioId')
    async findHorarioByOfertaIdHorarioId(@Param('ofertaId') ofertaId: string, @Param('horarioId') horarioId: string) {
        return await this.ofertaHorarioService.findHorarioByOfertaIdHorarioId(ofertaId, horarioId);
    }

    @Get(':ofertaId/horarios')
    async findHorariosByOfertaId(@Param('ofertaId') ofertaId: string) {
        return await this.ofertaHorarioService.findHorariosByOfertaId(ofertaId);
    }

    @Put(':ofertaId/horarios')
    async associateHorariosOferta(@Body() horariosDto: HorarioDto[], @Param('ofertaId') ofertaId: string) {
        const horarios: HorarioEntity[] = plainToInstance(HorarioEntity, horariosDto)
        return await this.ofertaHorarioService.associateHorariosOferta(ofertaId, horarios);
    }

    @Delete(':ofertaId/horarios/:horarioId')
    @HttpCode(204)
    async deleteHorarioOferta(@Param('ofertaId') ofertaId: string, @Param('horarioId') horarioId: string) {
        await this.ofertaHorarioService.deleteHorarioOferta(ofertaId, horarioId);
    }
    
}
