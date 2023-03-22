import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Role } from '../shared/security/roles';
import { HasRoles } from '../shared/security/roles.decorator';
import { ContratoDto } from './contrato.dto';
import { ContratoEntity } from './contrato.entity';
import { ContratoService } from './contrato.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('contratos')
export class ContratoController {

    constructor(private readonly contratoService: ContratoService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.USER)
    @Get()
    async findAll() {
        return await this.contratoService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.USER)
    @Get(':contratoId')
    async findOne(@Param('contratoId') contratoId: string) {
        return await this.contratoService.findOne(contratoId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN)
    @Post()
    async create(@Body() contratoDto: ContratoDto) {
        const contrato: ContratoEntity = plainToInstance(ContratoEntity, contratoDto)
        return await this.contratoService.create(contrato);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN)
    @Put(':contratoId')
    async update(@Param('contratoId') contratoId: string, @Body() contratoDto: ContratoDto) {
        const contrato: ContratoEntity = plainToInstance(ContratoEntity, contratoDto)
        return await this.contratoService.update(contratoId, contrato);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN)
    @Delete(':contratoId')
    @HttpCode(204)
    async delete(@Param('contratoId') contratoId: string) {
        await this.contratoService.delete(contratoId);
    }



}
