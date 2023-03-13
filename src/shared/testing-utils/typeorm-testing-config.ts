/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { AntecedenteEntity } from '../../antecedente/antecedente.entity';
import { ContratoEntity } from '../../contrato/contrato.entity';
import { EspecialidadEntity } from '../../especialidad/especialidad.entity';
import { HorarioEntity } from '../../horario/horario.entity';
import { NecesidadEntity } from '../../necesidad/necesidad.entity';
import { OfertaEntity } from '../../oferta/oferta.entity';
import { ReseniaEntity } from '../../resenia/resenia.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: false,
    entities: [AntecedenteEntity, ContratoEntity, EspecialidadEntity, HorarioEntity, NecesidadEntity, OfertaEntity, ReseniaEntity, UsuarioEntity],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([AntecedenteEntity, ContratoEntity, EspecialidadEntity, HorarioEntity, NecesidadEntity, OfertaEntity, ReseniaEntity, UsuarioEntity]),
];