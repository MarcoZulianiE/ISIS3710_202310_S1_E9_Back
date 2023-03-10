import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AntecedenteEntity } from 'src/antecedente/antecedente.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { UsuarioAntecedenteService } from './usuario-antecedente.service';
import { UsuarioAntecedenteController } from './usuario-antecedente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, AntecedenteEntity])],
  providers: [UsuarioAntecedenteService],
  controllers: [UsuarioAntecedenteController],
})
export class UsuarioAntecedenteModule {}
