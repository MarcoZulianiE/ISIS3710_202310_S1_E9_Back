import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioEntity } from '../horario/horario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { OfertaHorarioService } from './oferta-horario.service';
import { OfertaHorarioController } from './oferta-horario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OfertaEntity, HorarioEntity])],
  providers: [OfertaHorarioService],
  controllers: [OfertaHorarioController]
})
export class OfertaHorarioModule {}
