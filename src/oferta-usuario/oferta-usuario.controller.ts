import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsuarioDto } from 'src/usuario/usuario.dto';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { OfertaUsuarioService } from './oferta-usuario.service';

@Controller('oferta-usuario')
@UseInterceptors(BusinessErrorsInterceptor)
export class OfertaUsuarioController {

  constructor(private readonly OfertaUsuarioService: OfertaUsuarioService){}

  @Post(':ofertaId/usuarios/:usuarioId')
  async addUsuarioOferta(@Param('ofertaId') ofertaId: string, @Param('usuarioId') usuarioId: string){
    return await this.OfertaUsuarioService.addUsuarioOferta(ofertaId, usuarioId);
  }

  @Get(':ofertaId/usuarios/:usuarioId')
  async findUsuarioByOfertaIdUsuarioId(@Param('ofertaId') ofertaId: string, @Param('usuarioId') usuarioId: string){
    return await this.OfertaUsuarioService.findUsuarioByOfertaIdUsuarioId(ofertaId, usuarioId);
  }

  @Get(':ofertaId/usuarios')
  async findUsuarioByOfertaId(@Param('ofertaId') ofertaId: string){
    return await this.OfertaUsuarioService.findUsuarioByOfertaId(ofertaId);
  }

  @Put(':ofertaId/usuarios')
  async associateUsuarioOferta(@Body() usuarioDto: UsuarioDto, @Param('ofertaId') ofertaId: string){
    const usuario = plainToInstance(UsuarioEntity, usuarioDto)
    return await this.OfertaUsuarioService.associateUsuarioOferta(ofertaId, usuario);
  }

  @Delete(':ofertaId/usuarios/:usuarioId')
  @HttpCode(204)
  async deleteUsuarioOferta(@Param('ofertaId') ofertaId: string, @Param('usuarioId') usuarioId: string){
    return await this.OfertaUsuarioService.deleteUsuarioOferta(ofertaId, usuarioId);
  }
}
