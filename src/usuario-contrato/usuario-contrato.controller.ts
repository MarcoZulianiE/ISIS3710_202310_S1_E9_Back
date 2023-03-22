import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContratoDto } from '../contrato/contrato.dto';
import { ContratoEntity } from '../contrato/contrato.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioContratoService } from './usuario-contrato.service';
import { Role } from '../shared/security/roles';
import { HasRoles } from '../shared/security/roles.decorator';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioContratoController {

  constructor(private readonly usuarioContratoService: UsuarioContratoService){}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ESCRITORUSUARIO, Role.ADMINUSUARIO)
  @Post(':usuarioId/contratos/:contratoId')
  async addContratoUsuario(@Param('usuarioId') usuarioId: string, @Param('contratoId') contratoId: string){
    return await this.usuarioContratoService.addContratoUsuario(usuarioId, contratoId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.LECTORUSUARIO, Role.ADMINUSUARIO)
  @Get(':usuarioId/contratos/:contratoId')
  async findContratoByUsuarioIdContratoId(@Param('usuarioId') usuarioId: string, @Param('contratoId') contratoId: string){
    return await this.usuarioContratoService.findContratoByUsuarioIdContratoId(usuarioId, contratoId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.LECTORUSUARIO, Role.ADMINUSUARIO)
  @Get(':usuarioId/contratos')
  async findContratosByUsuarioId(@Param('usuarioId') usuarioId: string){
    return await this.usuarioContratoService.findContratosByUsuarioId(usuarioId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ESCRITORUSUARIO, Role.ADMINUSUARIO)
  @Put(':usuarioId/contratos')
  async associateContratosUsuario(@Body() contratoDto: ContratoDto[], @Param('usuarioId') usuarioId: string){
    const contratos = plainToInstance(ContratoEntity, contratoDto)
    return await this.usuarioContratoService.associateContratosUsuario(usuarioId, contratos);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ELIMINARUSUARIO, Role.ADMINUSUARIO)
  @Delete(':usuarioId/contratos/:contratoId')
  @HttpCode(204)
  async deleteContratoUsuario(@Param('usuarioId') usuarioId: string, @Param('contratoId') contratoId: string){
    return await this.usuarioContratoService.deleteContratoUsuario(usuarioId, contratoId);
  }

}
