import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OfertaEntity } from 'src/oferta/oferta.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioOfertaService } from './usuario-oferta.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioOfertaController {

  constructor(private readonly usuarioOfertaService: UsuarioOfertaService){}

  @Post(':usuarioId/ofertas/:ofertaId')
  async addOfertaUsuario(@Param('usuarioId') usuarioId: string, @Param('ofertaId') ofertaId: string){
    return await this.usuarioOfertaService.addOfertaUsuario(usuarioId, ofertaId);
  }

  @Get(':usuarioId/ofertas/:ofertaId')
  async findOfertaByUsuarioIdOfertaId(@Param('usuarioId') usuarioId: string, @Param('ofertaId') ofertaId: string){
    return await this.usuarioOfertaService.findOfertaByUsuarioIdOfertaId(usuarioId, ofertaId);
  }

  @Get(':usuarioId/ofertas')
  async findOfertasByUsuarioId(@Param('usuarioId') usuarioId: string){
    return await this.usuarioOfertaService.findOfertasByUsuarioId(usuarioId);
  }

//   TODO: Descomentar cuando ya este el DTO de Oferta
//   @Put(':usuarioId/ofertas')
//   async associateOfertasUsuario(@Body() ofertaDto: OfertaDto[], @Param('usuarioId') usuarioId: string){
//     const ofertas = plainToInstance(OfertaEntity, ofertaDto)
//     return await this.usuarioOfertaService.associateOfertasUsuario(usuarioId, ofertas);
//   }

  @Delete(':usuarioId/ofertas/:ofertaId')
  @HttpCode(204)
  async deleteOfertaUsuario(@Param('usuarioId') usuarioId: string, @Param('ofertaId') ofertaId: string){
    return await this.usuarioOfertaService.deleteOfertaUsuario(usuarioId, ofertaId);
  }

}
