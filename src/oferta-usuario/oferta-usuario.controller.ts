import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsuarioDto } from 'src/usuario/usuario.dto';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { OfertaUsuarioService } from './oferta-usuario.service';

@Controller('ofertas')
@UseInterceptors(BusinessErrorsInterceptor)
export class OfertaUsuarioController {

  constructor(private readonly ofertaUsuarioService: OfertaUsuarioService){}

  @Post(':ofertaId/usuarios/:usuarioId')
  async addUsuarioOferta(@Param('ofertaId') ofertaId: string, @Param('usuarioId') usuarioId: string){
    return await this.ofertaUsuarioService.addUsuarioOferta(ofertaId, usuarioId);
  }

  @Get(':ofertaId/usuarios/:usuarioId')
  async findUsuarioByOfertaIdUsuarioId(@Param('ofertaId') ofertaId: string, @Param('usuarioId') usuarioId: string){
    return await this.ofertaUsuarioService.findUsuarioByOfertaIdUsuarioId(ofertaId, usuarioId);
  }

  @Get(':ofertaId/usuarios')
  async findUsuarioByOfertaId(@Param('ofertaId') ofertaId: string){
    return await this.ofertaUsuarioService.findUsuarioByOfertaId(ofertaId);
  }

  @Put(':ofertaId/usuarios')
  async associateUsuarioOferta(@Body() usuarioDto: UsuarioDto, @Param('ofertaId') ofertaId: string){
    const usuario = plainToInstance(UsuarioEntity, usuarioDto)
    return await this.ofertaUsuarioService.associateUsuarioOferta(ofertaId, usuario);
  }

  @Delete(':ofertaId/usuarios/:usuarioId')
  @HttpCode(204)
  async deleteUsuarioOferta(@Param('ofertaId') ofertaId: string, @Param('usuarioId') usuarioId: string){
    return await this.ofertaUsuarioService.deleteUsuarioOferta(ofertaId, usuarioId);
  }
}
