import { Module } from '@nestjs/common';
import { AntecedenteModule } from './antecedente/antecedente.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContratoModule } from './contrato/contrato.module';
import { OfertaModule } from './oferta/oferta.module';
import { ReseniaModule } from './resenia/resenia.module';
import { UsuarioModule } from './usuario/usuario.module';
import { NecesidadModule } from './necesidad/necesidad.module';
import { EspecialidadModule } from './especialidad/especialidad.module';

@Module({
  imports: [OfertaModule, ContratoModule, AntecedenteModule, ReseniaModule, UsuarioModule, NecesidadModule, EspecialidadModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
