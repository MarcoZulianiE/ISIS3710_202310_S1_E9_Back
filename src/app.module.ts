import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AntecedenteEntity } from './antecedente/antecedente.entity';
import { AntecedenteModule } from './antecedente/antecedente.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContratoUsuarioModule } from './contrato-usuario/contrato-usuario.module';
import { ContratoEntity } from './contrato/contrato.entity';
import { ContratoModule } from './contrato/contrato.module';
import { EspecialidadEntity } from './especialidad/especialidad.entity';
import { EspecialidadModule } from './especialidad/especialidad.module';
import { HorarioOfertaModule } from './horario-oferta/horario-oferta.module';
import { HorarioEntity } from './horario/horario.entity';
import { HorarioModule } from './horario/horario.module';
import { NecesidadEntity } from './necesidad/necesidad.entity';
import { NecesidadModule } from './necesidad/necesidad.module';
import { OfertaHorarioModule } from './oferta-horario/oferta-horario.module';
import { OfertaUsuarioModule } from './oferta-usuario/oferta-usuario.module';
import { OfertaEntity } from './oferta/oferta.entity';
import { OfertaModule } from './oferta/oferta.module';
import { ReseniaUsuarioModule } from './resenia-usuario/resenia-usuario.module';
import { ReseniaEntity } from './resenia/resenia.entity';
import { ReseniaModule } from './resenia/resenia.module';
import { UsuarioAntecedenteModule } from './usuario-antecedente/usuario-antecedente.module';
import { UsuarioContratoModule } from './usuario-contrato/usuario-contrato.module';
import { UsuarioOfertaModule } from './usuario-oferta/usuario-oferta.module';
import { UsuarioReseniaModule } from './usuario-resenia/usuario-resenia.module';
import { UsuarioEntity } from './usuario/usuario.entity';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [OfertaModule, ContratoModule, AntecedenteModule, ReseniaModule, UsuarioModule, NecesidadModule, EspecialidadModule, HorarioModule,  OfertaHorarioModule, HorarioOfertaModule, UsuarioContratoModule, UsuarioOfertaModule, ContratoUsuarioModule, OfertaUsuarioModule, UsuarioReseniaModule, ReseniaUsuarioModule, UsuarioAntecedenteModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'kangaroo',
    entities: [UsuarioEntity, OfertaEntity, ContratoEntity, AntecedenteEntity, ReseniaEntity, NecesidadEntity, EspecialidadEntity, HorarioEntity],
    dropSchema: false,
    synchronize: true,
    keepConnectionAlive: true
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
