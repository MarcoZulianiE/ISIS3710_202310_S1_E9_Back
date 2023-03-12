import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaEntity } from '../oferta/oferta.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ContratoController } from './contrato.controller';
import { ContratoEntity } from './contrato.entity';
import { ContratoService } from './contrato.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContratoEntity, OfertaEntity, UsuarioEntity])],
  providers: [ContratoService],
  controllers: [ContratoController]
})
export class ContratoModule {}
