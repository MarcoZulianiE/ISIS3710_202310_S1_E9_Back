import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoEntity } from 'src/contrato/contrato.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { UsuarioContratoService } from './usuario-contrato.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, ContratoEntity])],
  providers: [UsuarioContratoService]
})
export class UsuarioContratoModule {}