import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { NecesidadDto } from '../necesidad/necesidad.dto';
import { NecesidadEntity } from '../necesidad/necesidad.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioNecesidadService } from './usuario-necesidad.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioNecesidadController {
   constructor(private readonly usuarioNecesidadService: UsuarioNecesidadService){}

   @Post(':usuarioId/necesidades/:necesidadId')
   async addNecesidadUsuario(@Param('usuarioId') usuarioId: string, @Param('necesidadId') necesidadId: string){
       return await this.usuarioNecesidadService.addNecesidadUsuario(usuarioId, necesidadId);
   }

   @Get(':usuarioId/necesidades/:necesidadId')
   async findNecesidadByUsuarioIdNecesidadId(@Param('usuarioId') usuarioId: string, @Param('necesidadId') necesidadId: string){
       return await this.usuarioNecesidadService.findNecesidadByUsuarioIdNecesidadId(usuarioId, necesidadId);
   }

   @Get(':usuarioId/necesidades')
   async findNecesidadesByUsuarioId(@Param('usuarioId') usuarioId: string){
       return await this.usuarioNecesidadService.findNecesidadesByUsuarioId(usuarioId);
   }

   @Put(':usuarioId/necesidades')
   async associateNecesidadesUsuario(@Body() necesidadesDto: NecesidadDto[], @Param('usuarioId') usuarioId: string){
       const necesidades = plainToInstance(NecesidadEntity, necesidadesDto)
       return await this.usuarioNecesidadService.associateNecesidadesUsuario(usuarioId, necesidades);
   }

   @Delete(':usuarioId/necesidades/:necesidadId')
   @HttpCode(204)
   async deleteNecesidadUsuario(@Param('usuarioId') usuarioId: string, @Param('necesidadId') necesidadId: string){
       return await this.usuarioNecesidadService.deleteNecesidadUsuario(usuarioId, necesidadId);
   }
}
