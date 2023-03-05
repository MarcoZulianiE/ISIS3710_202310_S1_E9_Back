import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NecesidadEntity } from '../necesidad/necesidad.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioNecesidadService } from './usuario-necesidad.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, NecesidadEntity])],
  providers: [UsuarioNecesidadService]
})
export class UsuarioNecesidadModule {}
