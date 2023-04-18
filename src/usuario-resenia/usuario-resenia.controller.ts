/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { Role } from 'src/shared/security/roles';
import { HasRoles } from 'src/shared/security/roles.decorator';
import { ReseniaDto } from '../resenia/resenia.dto';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { UsuarioReseniaService } from './usuario-resenia.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioReseniaController {
    constructor(private readonly usuarioReseniaService: UsuarioReseniaService){}


@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
@Post(':usuarioId/resenias/:reseniaId')
   async addReseniaUsuario(@Param('usuarioId') usuarioId: string, @Param('reseniaId') reseniaId: string){
       return await this.usuarioReseniaService.addReseniaUsuario(usuarioId, reseniaId);
   }

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
@Get(':usuarioId/resenias/:reseniaId')
   async findReseniaByUsuarioIdReseniaId(@Param('usuarioId') usuarioId: string, @Param('reseniaId') reseniaId: string){
       return await this.usuarioReseniaService.findReseniaByUsuarioIdReseniaId(usuarioId, reseniaId);
   }

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
@Get(':usuarioId/resenias')
   async findReseniasByUsuarioId(@Param('usuarioId') usuarioId: string){
       return await this.usuarioReseniaService.findReseniasByUsuarioId(usuarioId);
   }

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
@Put(':usuarioId/resenias')
   async associateReseniasUsuario(@Body() reseniasDto: ReseniaDto[], @Param('usuarioId') usuarioId: string){
       const resenias = plainToInstance(ReseniaEntity, reseniasDto)
       return await this.usuarioReseniaService.associateReseniasUsuario(usuarioId, resenias);
   }

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
@Delete(':usuarioId/resenias/:reseniaId')
@HttpCode(204)
   async deleteReseniaUsuario(@Param('usuarioId') usuarioId: string, @Param('reseniaId') reseniaId: string){
       return await this.usuarioReseniaService.deleteReseniaUsuario(usuarioId, reseniaId);
   }
}
