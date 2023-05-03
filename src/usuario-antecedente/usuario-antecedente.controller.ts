/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/shared/security/roles';
import { HasRoles } from 'src/shared/security/roles.decorator';
import { AntecedenteDto } from '../antecedente/antecedente.dto';
import { AntecedenteEntity } from '../antecedente/antecedente.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioAntecedenteService } from './usuario-antecedente.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioAntecedenteController {
    constructor(private readonly usuarioAntecedenteService: UsuarioAntecedenteService){}

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ADMIN)    
@Post(':usuarioId/antecedentes/:antecedenteId')
    async addAntecedenteUsuario(@Param('usuarioId') usuarioId: string, @Param('antecedenteId') antecedenteId: string){
        return await this.usuarioAntecedenteService.addAntecedenteUsuario(usuarioId, antecedenteId);
    }
 
// @UseGuards(JwtAuthGuard, RolesGuard)
// @HasRoles(Role.LECTORUSUARIO, Role.ADMINUSUARIO)   
// @Get(':usuarioId/antecedentes/:antecedenteId')
//     async findAntecedenteByUsuarioIdAntecedenteId(@Param('usuarioId') usuarioId: string, @Param('antecedenteId') antecedenteId: string){
//         return await this.usuarioAntecedenteService.findAntecedenteByUsuarioIdAntecedenteId(usuarioId, antecedenteId);
//     }

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ADMIN, Role.USER) 
@Get(':usuarioId/antecedentes')
    async findAntecedentesByUsuarioId(@Param('usuarioId') usuarioId: string){
        return await this.usuarioAntecedenteService.findAntecedentesByUsuarioId(usuarioId);
    }

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ADMIN) 
@Put(':usuarioId/antecedentes')
    async associateAntecedentesUsuario(@Body() antecedentesDto: AntecedenteDto[], @Param('usuarioId') usuarioId: string){
        const antecedentes = plainToInstance(AntecedenteEntity, antecedentesDto)
        return await this.usuarioAntecedenteService.associateAntecedentesUsuario(usuarioId, antecedentes);
    }
 
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ADMIN) 
@Delete(':usuarioId/antecedentes/:antecedenteId')
@HttpCode(204)
    async deleteAntecedenteUsuario(@Param('usuarioId') usuarioId: string, @Param('antecedenteId') antecedenteId: string){
        return await this.usuarioAntecedenteService.deleteAntecedenteUsuario(usuarioId, antecedenteId);
    }
}
