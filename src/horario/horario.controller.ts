import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../shared/security/roles';
import { HasRoles } from '../shared/security/roles.decorator';
import { HorarioDto } from './horario.dto';
import { HorarioEntity } from './horario.entity';
import { HorarioService } from './horario.service';

@Controller('horarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class HorarioController {
    constructor(private readonly horarioService: HorarioService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.USER, Role.ADMIN, Role.LECTORHORARIO)
    @Get()
    async findAll() {
        return await this.horarioService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.USER, Role.ADMIN, Role.LECTORHORARIO)
    @Get(':horarioId')
    async findOne(@Param('horarioId') horarioId: string) {
        return await this.horarioService.findOne(horarioId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.USER, Role.ADMIN, Role.ESCRITORHORARIO)
    @Post()
    async create(@Body() horarioDto: HorarioDto) {
        const horario: HorarioEntity = plainToInstance(HorarioEntity, horarioDto)
        return await this.horarioService.create(horario);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.USER, Role.ADMIN, Role.ESCRITORHORARIO)
    @Put(':horarioId')
    async update(@Param('horarioId') horarioId: string, @Body() horarioDto: HorarioDto) {
        const horario: HorarioEntity = plainToInstance(HorarioEntity, horarioDto)
        return await this.horarioService.update(horarioId, horario);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.USER, Role.ADMIN, Role.ELIMINARHORARIO)
    @Delete(':horarioId')
    @HttpCode(204)
    async delete(@Param('horarioId') horarioId: string) {
        await this.horarioService.delete(horarioId);
    }
}
