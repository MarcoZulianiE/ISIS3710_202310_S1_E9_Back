import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EspecialidadDto } from '../especialidad/especialidad.dto';
import { EspecialidadEntity } from '../especialidad/especialidad.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioEspecialidadService } from './usuario-especialidad.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioEspecialidadController {
   constructor(private readonly usuarioEspecialidadService: UsuarioEspecialidadService){}

   @Post(':usuarioId/especialidades/:especialidadId')
   async addEspecialidadUsuario(@Param('usuarioId') usuarioId: string, @Param('especialidadId') especialidadId: string){
       return await this.usuarioEspecialidadService.addEspecialidadUsuario(usuarioId, especialidadId);
   }

   @Get(':usuarioId/especialidades/:especialidadId')
   async findEspecialidadByUsuarioIdEspecialidadId(@Param('usuarioId') usuarioId: string, @Param('especialidadId') especialidadId: string){
       return await this.usuarioEspecialidadService.findEspecialidadByUsuarioIdEspecialidadId(usuarioId, especialidadId);
   }

   @Get(':usuarioId/especialidades')
   async findEspecialidadesByUsuarioId(@Param('usuarioId') usuarioId: string){
       return await this.usuarioEspecialidadService.findEspecialidadesByUsuarioId(usuarioId);
   }

   @Put(':usuarioId/especialidades')
   async associateEspecialidadesUsuario(@Body() especialidadesDto: EspecialidadDto[], @Param('usuarioId') usuarioId: string){
       const especialidades = plainToInstance(EspecialidadEntity, especialidadesDto)
       return await this.usuarioEspecialidadService.associateEspecialidadesUsuario(usuarioId, especialidades);
   }

   @Delete(':usuarioId/especialidades/:especialidadId')
   @HttpCode(204)
   async deleteEspecialidadUsuario(@Param('usuarioId') usuarioId: string, @Param('especialidadId') especialidadId: string){
       return await this.usuarioEspecialidadService.deleteEspecialidadUsuario(usuarioId, especialidadId);
   }
}
