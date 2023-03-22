import { Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Role } from '../shared/security/roles';
import { HasRoles } from '../shared/security/roles.decorator';
import { HorarioOfertaService } from './horario-oferta.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('horarios')
export class HorarioOfertaController {
    constructor(private readonly horarioOfertaService: HorarioOfertaService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.USER)
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.USER)
    @Delete(':horarioId/ofertas/:ofertaId')
    @HttpCode(204)
    async deleteOfertaHorario(@Param('horarioId') horarioId: string, @Param('ofertaId') ofertaId: string) {
        await this.horarioOfertaService.deleteOfertaHorario(horarioId, ofertaId);
    }
    
}
