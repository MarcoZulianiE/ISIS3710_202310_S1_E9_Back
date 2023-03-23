/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { Role } from 'src/shared/security/roles';
import { HasRoles } from 'src/shared/security/roles.decorator';
import { UsuarioDto } from '../usuario/usuario.dto';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ReseniaUsuarioService } from './resenia-usuario.service';

@Controller('resenia')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReseniaUsuarioController {

    constructor(private readonly reseniaUsuarioService: ReseniaUsuarioService){}

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ESCRITORRESENIA, Role.ADMINRESENIA)
@Post(':reseniaId/usuarios/:usuarioId')
   async addUsuarioResenia(@Param('reseniaId') reseniaId: string, @Param('usuarioId') usuarioId: string){
       return await this.reseniaUsuarioService.addUsuarioResenia(reseniaId, usuarioId);
   }

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.LECTORRESENIA, Role.ADMINRESENIA)
@Get(':reseniaId/usuarios/:usuarioId')
   async findUsuarioByReseniaIdUsuarioId(@Param('reseniaId') reseniaId: string, @Param('usuarioId') usuarioId: string){
       return await this.reseniaUsuarioService.findUsuarioByReseniaIdUsuarioId(reseniaId, usuarioId);
   }

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.LECTORRESENIA, Role.ADMINRESENIA)
@Get(':reseniaId/usuarios')
   async findUsuariosByReseniaId(@Param('reseniaId') reseniaId: string){
       return await this.reseniaUsuarioService.findUsuarioByReseniaId(reseniaId);
   }

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ESCRITORRESENIA, Role.ADMINRESENIA)
@Put(':reseniaId/usuarios')
    async associateUsuariosResenia(@Body() usuarioDto: UsuarioDto, @Param('reseniaId') reseniaId: string){
        const usuario = plainToInstance(UsuarioEntity, usuarioDto)
        return await this.reseniaUsuarioService.associateUsuarioResenia(reseniaId, usuario);
    }

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ELIMINARRESENIA, Role.ADMINRESENIA)    
@Delete(':reseniaId/usuarios/:usuarioId')
@HttpCode(204)
   async deleteUsuarioResenia(@Param('reseniaId') reseniaId: string, @Param('usuarioId') usuarioId: string){
       return await this.reseniaUsuarioService.deleteUsuarioResenia(reseniaId, usuarioId);
   }
}
