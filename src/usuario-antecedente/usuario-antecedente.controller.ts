/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AntecedenteDto } from '../antecedente/antecedente.dto';
import { AntecedenteEntity } from '../antecedente/antecedente.entity';
import { UsuarioAntecedenteService } from './usuario-antecedente.service';

@Controller('usuario')
export class UsuarioAntecedenteController {
    constructor(private readonly usuarioAntecedenteService: UsuarioAntecedenteService){}
    
@Post(':usuarioId/antecedentes/:antecedenteId')
    async addAntecedenteUsuario(@Param('usuarioId') usuarioId: string, @Param('antecedenteId') antecedenteId: string){
        return await this.usuarioAntecedenteService.addAntecedenteUsuario(usuarioId, antecedenteId);
    }
 
 @Get(':usuarioId/antecedentes/:antecedenteId')
    async findAntecedenteByUsuarioIdAntecedenteId(@Param('usuarioId') usuarioId: string, @Param('antecedenteId') antecedenteId: string){
        return await this.usuarioAntecedenteService.findAntecedenteByUsuarioIdAntecedenteId(usuarioId, antecedenteId);
    }
 
 @Get(':usuarioId/antecedentes')
    async findAntecedentesByUsuarioId(@Param('usuarioId') usuarioId: string){
        return await this.usuarioAntecedenteService.findAntecedentesByUsuarioId(usuarioId);
    }
 
 @Put(':usuarioId/antecedentes')
    async associateAntecedentesUsuario(@Body() antecedentesDto: AntecedenteDto[], @Param('usuarioId') usuarioId: string){
        const antecedentes = plainToInstance(AntecedenteEntity, antecedentesDto)
        return await this.usuarioAntecedenteService.associateAntecedentesUsuario(usuarioId, antecedentes);
    }
 
 @Delete(':usuarioId/antecedentes/:antecedenteId')
 @HttpCode(204)
    async deleteAntecedenteUsuario(@Param('usuarioId') usuarioId: string, @Param('antecedenteId') antecedenteId: string){
        return await this.usuarioAntecedenteService.deleteAntecedenteUsuario(usuarioId, antecedenteId);
    }
}
