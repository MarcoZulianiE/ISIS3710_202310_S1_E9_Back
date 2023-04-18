import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HorarioDto } from '../horario/horario.dto';
import { HorarioEntity } from '../horario/horario.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Role } from '../shared/security/roles';
import { HasRoles } from '../shared/security/roles.decorator';
import { OfertaHorarioService } from './oferta-horario.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('ofertas')
export class OfertaHorarioController {
    constructor(private readonly ofertaHorarioService: OfertaHorarioService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
    @Put(':ofertaId/horarios')
    async associateHorariosOferta(@Body() horariosDto: HorarioDto[], @Param('ofertaId') ofertaId: string) {
        const horarios: HorarioEntity[] = plainToInstance(HorarioEntity, horariosDto)
        return await this.ofertaHorarioService.associateHorariosOferta(ofertaId, horarios);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
    @Delete(':ofertaId/horarios/:horarioId')
    @HttpCode(204)
    async deleteHorarioOferta(@Param('ofertaId') ofertaId: string, @Param('horarioId') horarioId: string) {
        await this.ofertaHorarioService.deleteHorarioOferta(ofertaId, horarioId);
    }
    
}
