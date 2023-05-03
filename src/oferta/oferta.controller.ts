import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../shared/security/roles';
import { HasRoles } from '../shared/security/roles.decorator';
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN, Role.USER) 
    @Post()
    async create(@Body() ofertaDto: OfertaDto) {
        const oferta: OfertaEntity = plainToInstance(OfertaEntity, ofertaDto)
        return await this.ofertaService.create(oferta);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
    @Put(':ofertaId')
    async update(@Param('ofertaId') ofertaId: string, @Body() ofertaDto: OfertaDto) {
        const oferta: OfertaEntity = plainToInstance(OfertaEntity, ofertaDto)
        return await this.ofertaService.update(ofertaId, oferta);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
    @Delete(':ofertaId')
    @HttpCode(204)
    async delete(@Param('ofertaId') ofertaId: string) {
        await this.ofertaService.delete(ofertaId);
    }
}
