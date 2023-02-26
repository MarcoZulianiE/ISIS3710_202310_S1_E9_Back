/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { AntecedenteEntity } from 'src/antecedente/antecedente.entity';
import { ContratoEntity } from 'src/contrato/contrato.entity';
import { EspecialidadEntity } from 'src/especialidad/especialidad.entity';
import { HorarioEntity } from 'src/horario/horario.entity';
import { NecesidadEntity } from 'src/necesidad/necesidad.entity';
import { OfertaEntity } from 'src/oferta/oferta.entity';
import { ReseniaEntity } from 'src/resenia/resenia.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [AntecedenteEntity, ContratoEntity, EspecialidadEntity, HorarioEntity, NecesidadEntity, OfertaEntity, ReseniaEntity],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([AntecedenteEntity, ContratoEntity, EspecialidadEntity, HorarioEntity, NecesidadEntity, OfertaEntity, ReseniaEntity]),
];