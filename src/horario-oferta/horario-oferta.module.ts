import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioEntity } from '../horario/horario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { HorarioOfertaService } from './horario-oferta.service';

@Module({
  imports: [TypeOrmModule.forFeature([OfertaEntity, HorarioEntity])],
  providers: [HorarioOfertaService]
})
export class HorarioOfertaModule {}
