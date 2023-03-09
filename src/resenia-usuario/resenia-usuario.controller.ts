/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { ReseniaUsuarioService } from './resenia-usuario.service';

@Controller('resenia')
export class ReseniaUsuarioController {

    constructor(private readonly reseniaUsuarioService: ReseniaUsuarioService){}

@Post(':reseniaId/usuarios/:usuarioId')
   async addUsuarioResenia(@Param('reseniaId') reseniaId: string, @Param('usuarioId') usuarioId: string){
       return await this.reseniaUsuarioService.addUsuarioResenia(reseniaId, usuarioId);
   }

@Get(':reseniaId/usuarios/:usuarioId')
   async findUsuarioByReseniaIdUsuarioId(@Param('reseniaId') reseniaId: string, @Param('usuarioId') usuarioId: string){
       return await this.reseniaUsuarioService.findUsuarioByReseniaIdUsuarioId(reseniaId, usuarioId);
   }

@Get(':reseniaId/usuarios')
   async findUsuariosByReseniaId(@Param('reseniaId') reseniaId: string){
       return await this.reseniaUsuarioService.findUsuarioByReseniaId(reseniaId);
   }

@Put(':reseniaId/usuarios')
   async associateUsuarioResenia(@Body() usuarioDto: UsuarioDto, @Param('reseniaId') reseniaId: string){
       const usuario = plainToInstance(UsuarioEntity, usuarioDto)
       return await this.reseniaUsuarioService.associateUsuarioResenia(reseniaId, usuario);
   }

@Delete(':reseniaId/usuarios/:usuarioId')
@HttpCode(204)
   async deleteUsuarioResenia(@Param('reseniaId') reseniaId: string, @Param('usuarioId') usuarioId: string){
       return await this.reseniaUsuarioService.deleteUsuarioResenia(reseniaId, usuarioId);
   }
}
