/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/shared/security/roles';
import { HasRoles } from 'src/shared/security/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AntecedenteDto } from './antecedente.dto';
import { AntecedenteEntity } from './antecedente.entity';
import { AntecedenteService } from './antecedente.service';

@Controller('antecedentes')
@UseInterceptors(BusinessErrorsInterceptor)
export class AntecedenteController {
    constructor(private readonly antecedenteService: AntecedenteService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.LECTORANTECEDENTE, Role.ADMINANTECEDENTE)
    @Get()
    async findAll() {
        return await this.antecedenteService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.LECTORANTECEDENTE, Role.ADMINANTECEDENTE)
    @Get(':antecedenteId')
    async findOne(@Param('antecedenteId') antecedenteId: string) {
        return await this.antecedenteService.findOne(antecedenteId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMINANTECEDENTE)
    @Post()
    async create(@Body() antecedenteDto: AntecedenteDto) {
        const antecedente: AntecedenteEntity = plainToInstance(AntecedenteEntity, antecedenteDto);
        return await this.antecedenteService.create(antecedente);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMINANTECEDENTE)
    @Put(':antecedenteId')
    async update(@Param('antecedenteId') antecedenteId: string, @Body() antecedenteDto: AntecedenteDto) {
        const antecedente: AntecedenteEntity = plainToInstance(AntecedenteEntity, antecedenteDto);
        return await this.antecedenteService.update(antecedenteId, antecedente);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMINANTECEDENTE)   
    @Delete(':antecedenteId')
    @HttpCode(204)
    async delete(@Param('antecedenteId') antecedenteId: string) {
        return await this.antecedenteService.delete(antecedenteId);
    }
}
