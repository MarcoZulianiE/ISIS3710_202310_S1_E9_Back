/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/shared/security/roles';
import { HasRoles } from 'src/shared/security/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReseniaDto } from './resenia.dto';
import { ReseniaEntity } from './resenia.entity';
import { ReseniaService } from './resenia.service';


@Controller('resenias')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReseniaController {
    constructor(private readonly reseniaService: ReseniaService) {}


    @Get()
    async findAll() {
        return await this.reseniaService.findAll();
    }
    

    @Get(':reseniaId')
    async findOne(@Param('reseniaId') reseniaId: string) {
        return await this.reseniaService.findOne(reseniaId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN, Role.USER) 
    @Post()
    async create(@Body() reseniaDto: ReseniaDto) {
        const resenia: ReseniaEntity = plainToInstance(ReseniaEntity, reseniaDto);
        return await this.reseniaService.create(resenia);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
    @Put(':reseniaId')
    async update(@Param('reseniaId') reseniaId: string, @Body() reseniaDto: ReseniaDto) {
        const resenia: ReseniaEntity = plainToInstance(ReseniaEntity, reseniaDto);
        return await this.reseniaService.update(reseniaId, resenia);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
    @Delete(':reseniaId')
    @HttpCode(204)
    async delete(@Param('reseniaId') reseniaId: string) {
        return await this.reseniaService.delete(reseniaId);
    }
}