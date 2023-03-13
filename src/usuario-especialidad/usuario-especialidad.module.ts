import { Module } from '@nestjs/common';
import { UsuarioEspecialidadService } from './usuario-especialidad.service';
import { UsuarioEspecialidadController } from './usuario-especialidad.controller';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecialidadEntity } from '../especialidad/especialidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, EspecialidadEntity])],
  providers: [UsuarioEspecialidadService],
  controllers: [UsuarioEspecialidadController]
})
export class UsuarioEspecialidadModule {}
