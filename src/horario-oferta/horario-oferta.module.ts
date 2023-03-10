import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioEntity } from '../horario/horario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { HorarioOfertaService } from './horario-oferta.service';
import { HorarioOfertaController } from './horario-oferta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OfertaEntity, HorarioEntity])],
  providers: [HorarioOfertaService],
  controllers: [HorarioOfertaController]
})
export class HorarioOfertaModule {}
