import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/shared/security/roles';
import { HasRoles } from 'src/shared/security/roles.decorator';
import { NecesidadDto } from '../necesidad/necesidad.dto';
import { NecesidadEntity } from '../necesidad/necesidad.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioNecesidadService } from './usuario-necesidad.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioNecesidadController {
   constructor(private readonly usuarioNecesidadService: UsuarioNecesidadService){}

   @UseGuards(JwtAuthGuard, RolesGuard)
   @HasRoles(Role.ESCRITORNECESIDAD, Role.ADMINNECESIDAD)
   @Post(':usuarioId/necesidades/:necesidadId')
   async addNecesidadUsuario(@Param('usuarioId') usuarioId: string, @Param('necesidadId') necesidadId: string){
       return await this.usuarioNecesidadService.addNecesidadUsuario(usuarioId, necesidadId);
   }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @HasRoles(Role.LECTORUSUARIO, Role.LECTORNECESIDAD, Role.ADMINNECESIDAD)
   @Get(':usuarioId/necesidades/:necesidadId')
   async findNecesidadByUsuarioIdNecesidadId(@Param('usuarioId') usuarioId: string, @Param('necesidadId') necesidadId: string){
       return await this.usuarioNecesidadService.findNecesidadByUsuarioIdNecesidadId(usuarioId, necesidadId);
   }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @HasRoles(Role.ESCRITORUSUARIO, Role.ADMINNECESIDAD)
   @Get(':usuarioId/necesidades')
   async findNecesidadesByUsuarioId(@Param('usuarioId') usuarioId: string){
       return await this.usuarioNecesidadService.findNecesidadesByUsuarioId(usuarioId);
   }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @HasRoles(Role.ESCRITORNECESIDAD, Role.ADMINNECESIDAD)
   @Put(':usuarioId/necesidades')
   async associateNecesidadesUsuario(@Body() necesidadesDto: NecesidadDto[], @Param('usuarioId') usuarioId: string){
       const necesidades = plainToInstance(NecesidadEntity, necesidadesDto)
       return await this.usuarioNecesidadService.associateNecesidadesUsuario(usuarioId, necesidades);
   }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @HasRoles(Role.ESCRITORNECESIDAD, Role.ADMINNECESIDAD, Role.ADMIN)
   @Delete(':usuarioId/necesidades/:necesidadId')
   @HttpCode(204)
   async deleteNecesidadUsuario(@Param('usuarioId') usuarioId: string, @Param('necesidadId') necesidadId: string){
       return await this.usuarioNecesidadService.deleteNecesidadUsuario(usuarioId, necesidadId);
   }
}
