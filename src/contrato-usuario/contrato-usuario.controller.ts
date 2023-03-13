import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsuarioDto } from 'src/usuario/usuario.dto';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ContratoUsuarioService } from './contrato-usuario.service';

@Controller('contratos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ContratoUsuarioController {

  constructor(private readonly contratoUsuarioService: ContratoUsuarioService){}

  @Post(':contratoId/usuarios/:usuarioId')
  async addUsuarioContrato(@Param('contratoId') contratoId: string, @Param('usuarioId') usuarioId: string){
    return await this.contratoUsuarioService.addUsuarioContrato(contratoId, usuarioId);
  }

  @Get(':contratoId/usuarios/:usuarioId')
  async findUsuarioByContratoIdUsuarioId(@Param('contratoId') contratoId: string, @Param('usuarioId') usuarioId: string){
    return await this.contratoUsuarioService.findUsuarioByContratoIdUsuarioId(contratoId, usuarioId);
  }

  @Get(':contratoId/usuarios')
  async findUsuarioByContratoId(@Param('contratoId') contratoId: string){
    return await this.contratoUsuarioService.findUsuarioByContratoId(contratoId);
  }

  @Put(':contratoId/usuarios')
  async associateUsuarioContrato(@Body() usuarioDto: UsuarioDto, @Param('contratoId') contratoId: string){
    const usuario = plainToInstance(UsuarioEntity, usuarioDto)
    return await this.contratoUsuarioService.associateUsuarioContrato(contratoId, usuario);
  }

  @Delete(':contratoId/usuarios/:usuarioId')
  @HttpCode(204)
  async deleteUsuarioContrato(@Param('contratoId') contratoId: string, @Param('usuarioId') usuarioId: string){
    return await this.contratoUsuarioService.deleteUsuarioContrato(contratoId, usuarioId);
  }
}
