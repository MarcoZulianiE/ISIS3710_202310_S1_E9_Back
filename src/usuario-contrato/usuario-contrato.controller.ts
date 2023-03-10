import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ContratoEntity } from 'src/contrato/contrato.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioContratoService } from './usuario-contrato.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioContratoController {

  constructor(private readonly usuarioContratoService: UsuarioContratoService){}

  @Post(':usuarioId/contratos/:contratoId')
  async addContratoUsuario(@Param('usuarioId') usuarioId: string, @Param('contratoId') contratoId: string){
    return await this.usuarioContratoService.addContratoUsuario(usuarioId, contratoId);
  }

  @Get(':usuarioId/contratos/:contratoId')
  async findContratoByUsuarioIdContratoId(@Param('usuarioId') usuarioId: string, @Param('contratoId') contratoId: string){
    return await this.usuarioContratoService.findContratoByUsuarioIdContratoId(usuarioId, contratoId);
  }

  @Get(':usuarioId/contratos')
  async findContratosByUsuarioId(@Param('usuarioId') usuarioId: string){
    return await this.usuarioContratoService.findContratosByUsuarioId(usuarioId);
  }

//   TODO: Descomentar cuando ya este el DTO de Contrato
//   @Put(':usuarioId/contratos')
//   async associateContratosUsuario(@Body() contratoDto: ContratoDto[], @Param('usuarioId') usuarioId: string){
//     const contratos = plainToInstance(ContratoEntity, contratoDto)
//     return await this.usuarioContratoService.associateContratosUsuario(usuarioId, contratos);
//   }

  @Delete(':usuarioId/contratos/:contratoId')
  @HttpCode(204)
  async deleteContratoUsuario(@Param('usuarioId') usuarioId: string, @Param('contratoId') contratoId: string){
    return await this.usuarioContratoService.deleteContratoUsuario(usuarioId, contratoId);
  }

}
