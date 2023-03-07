import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaEntity } from '../oferta/oferta.entity';
import { ContratoEntity } from './contrato.entity';
import { ContratoService } from './contrato.service';
import { ContratoController } from './contrato.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContratoEntity, OfertaEntity])],
  providers: [ContratoService],
  controllers: [ContratoController]
})
export class ContratoModule {}
