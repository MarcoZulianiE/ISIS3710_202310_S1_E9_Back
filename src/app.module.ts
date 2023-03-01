import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AntecedenteEntity } from './antecedente/antecedente.entity';
import { AntecedenteModule } from './antecedente/antecedente.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContratoEntity } from './contrato/contrato.entity';
import { ContratoModule } from './contrato/contrato.module';
import { EspecialidadEntity } from './especialidad/especialidad.entity';
import { EspecialidadModule } from './especialidad/especialidad.module';
import { HorarioEntity } from './horario/horario.entity';
import { HorarioModule } from './horario/horario.module';
import { NecesidadEntity } from './necesidad/necesidad.entity';
import { NecesidadModule } from './necesidad/necesidad.module';
import { OfertaEntity } from './oferta/oferta.entity';
import { OfertaModule } from './oferta/oferta.module';
import { ReseniaEntity } from './resenia/resenia.entity';
import { ReseniaModule } from './resenia/resenia.module';
import { UsuarioEntity } from './usuario/usuario.entity';
import { UsuarioModule } from './usuario/usuario.module';
import { OfertaHorarioService } from './oferta-horario/oferta-horario.service';
import { OfertaHorarioModule } from './oferta-horario/oferta-horario.module';
import { HorarioOfertaModule } from './horario-oferta/horario-oferta.module';

@Module({
  imports: [OfertaModule, ContratoModule, AntecedenteModule, ReseniaModule, UsuarioModule, NecesidadModule, EspecialidadModule, HorarioModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'kangaroo',
    entities: [UsuarioEntity, OfertaEntity, ContratoEntity, AntecedenteEntity, ReseniaEntity, NecesidadEntity, EspecialidadEntity, HorarioEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }),
  OfertaHorarioModule,
  HorarioOfertaModule],
  controllers: [AppController],
  providers: [AppService, OfertaHorarioService],
})
export class AppModule {}
