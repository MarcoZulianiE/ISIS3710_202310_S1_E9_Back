import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OfertaDto } from '../oferta/oferta.dto';
import { OfertaEntity } from '../oferta/oferta.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Role } from '../shared/security/roles';
import { HasRoles } from '../shared/security/roles.decorator';
import { UsuarioOfertaService } from './usuario-oferta.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioOfertaController {

  constructor(private readonly usuarioOfertaService: UsuarioOfertaService){}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @HasRoles(Role.ESCRITORUSUARIO, Role.ADMINUSUARIO)
  // @Post(':usuarioId/ofertas/:ofertaId')
  // async addOfertaUsuario(@Param('usuarioId') usuarioId: string, @Param('ofertaId') ofertaId: string){
  //   return await this.usuarioOfertaService.addOfertaUsuario(usuarioId, ofertaId);
  // }


  @Get(':usuarioId/ofertas/:ofertaId')
  async findOfertaByUsuarioIdOfertaId(@Param('usuarioId') usuarioId: string, @Param('ofertaId') ofertaId: string){
    return await this.usuarioOfertaService.findOfertaByUsuarioIdOfertaId(usuarioId, ofertaId);
  }

  @Get(':usuarioId/ofertas')
  async findOfertasByUsuarioId(@Param('usuarioId') usuarioId: string){
    return await this.usuarioOfertaService.findOfertasByUsuarioId(usuarioId);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @HasRoles(Role.ESCRITORUSUARIO, Role.ADMINUSUARIO)
  // @Put(':usuarioId/ofertas')
  // async associateOfertasUsuario(@Body() ofertaDto: OfertaDto[], @Param('usuarioId') usuarioId: string){
  //   const ofertas = plainToInstance(OfertaEntity, ofertaDto)
  //   return await this.usuarioOfertaService.associateOfertasUsuario(usuarioId, ofertas);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
  @Delete(':usuarioId/ofertas/:ofertaId')
  @HttpCode(204)
  async deleteOfertaUsuario(@Param('usuarioId') usuarioId: string, @Param('ofertaId') ofertaId: string){
    return await this.usuarioOfertaService.deleteOfertaUsuario(usuarioId, ofertaId);
  }

}
