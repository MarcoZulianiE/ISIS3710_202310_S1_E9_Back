import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../shared/security/roles';
import { HasRoles } from '../shared/security/roles.decorator';
import { UsuarioDto } from '../usuario/usuario.dto';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ContratoUsuarioService } from './contrato-usuario.service';

@Controller('contratos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ContratoUsuarioController {

  constructor(private readonly contratoUsuarioService: ContratoUsuarioService){}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ESCRITORCONTRATO, Role.ADMINCONTRATO)
  @Post(':contratoId/usuarios/:usuarioId')
  async addUsuarioContrato(@Param('contratoId') contratoId: string, @Param('usuarioId') usuarioId: string){
    return await this.contratoUsuarioService.addUsuarioContrato(contratoId, usuarioId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.LECTORCONTRATO, Role.ADMINCONTRATO)
  @Get(':contratoId/usuarios/:usuarioId')
  async findUsuarioByContratoIdUsuarioId(@Param('contratoId') contratoId: string, @Param('usuarioId') usuarioId: string){
    return await this.contratoUsuarioService.findUsuarioByContratoIdUsuarioId(contratoId, usuarioId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.LECTORCONTRATO, Role.ADMINCONTRATO)
  @Get(':contratoId/usuarios')
  async findUsuarioByContratoId(@Param('contratoId') contratoId: string){
    return await this.contratoUsuarioService.findUsuarioByContratoId(contratoId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ESCRITORCONTRATO, Role.ADMINCONTRATO)
  @Put(':contratoId/usuarios')
  async associateUsuarioContrato(@Body() usuarioDto: UsuarioDto, @Param('contratoId') contratoId: string){
    const usuario = plainToInstance(UsuarioEntity, usuarioDto)
    return await this.contratoUsuarioService.associateUsuarioContrato(contratoId, usuario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ELIMINARCONTRATO, Role.ADMINCONTRATO)
  @Delete(':contratoId/usuarios/:usuarioId')
  @HttpCode(204)
  async deleteUsuarioContrato(@Param('contratoId') contratoId: string, @Param('usuarioId') usuarioId: string){
    return await this.contratoUsuarioService.deleteUsuarioContrato(contratoId, usuarioId);
  }
}
