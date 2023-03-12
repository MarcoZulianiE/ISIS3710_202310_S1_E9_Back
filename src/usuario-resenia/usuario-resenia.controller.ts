/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ReseniaDto } from '../resenia/resenia.dto';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { UsuarioReseniaService } from './usuario-resenia.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioReseniaController {
    constructor(private readonly usuarioReseniaService: UsuarioReseniaService){}

@Post(':usuarioId/resenias/:reseniaId')
   async addReseniaUsuario(@Param('usuarioId') usuarioId: string, @Param('reseniaId') reseniaId: string){
       return await this.usuarioReseniaService.addReseniaUsuario(usuarioId, reseniaId);
   }

@Get(':usuarioId/resenias/:reseniaId')
   async findReseniaByUsuarioIdReseniaId(@Param('usuarioId') usuarioId: string, @Param('reseniaId') reseniaId: string){
       return await this.usuarioReseniaService.findReseniaByUsuarioIdReseniaId(usuarioId, reseniaId);
   }

@Get(':usuarioId/resenias')
   async findReseniasByUsuarioId(@Param('usuarioId') usuarioId: string){
       return await this.usuarioReseniaService.findReseniasByUsuarioId(usuarioId);
   }

@Put(':usuarioId/resenias')
   async associateReseniasUsuario(@Body() reseniasDto: ReseniaDto[], @Param('usuarioId') usuarioId: string){
       const resenias = plainToInstance(ReseniaEntity, reseniasDto)
       return await this.usuarioReseniaService.associateReseniasUsuario(usuarioId, resenias);
   }

@Delete(':usuarioId/resenias/:reseniaId')
@HttpCode(204)
   async deleteReseniaUsuario(@Param('usuarioId') usuarioId: string, @Param('reseniaId') reseniaId: string){
       return await this.usuarioReseniaService.deleteReseniaUsuario(usuarioId, reseniaId);
   }
}
