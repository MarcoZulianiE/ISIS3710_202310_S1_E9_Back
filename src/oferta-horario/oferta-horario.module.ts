import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioEntity } from '../horario/horario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { OfertaHorarioService } from './oferta-horario.service';

@Module({
  imports: [TypeOrmModule.forFeature([OfertaEntity, HorarioEntity])],
  providers: [OfertaHorarioService]
})
export class OfertaHorarioModule {}
