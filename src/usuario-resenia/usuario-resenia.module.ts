/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseniaEntity } from 'src/resenia/resenia.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { UsuarioReseniaService } from './usuario-resenia.service';
import { UsuarioReseniaController } from './usuario-resenia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, ReseniaEntity])],
  providers: [UsuarioReseniaService],
  controllers: [UsuarioReseniaController]
})
export class UsuarioReseniaModule {}
