import { Module } from '@nestjs/common';
import { AntecedenteModule } from './antecedente/antecedente.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContratoModule } from './contrato/contrato.module';
import { OfertaModule } from './oferta/oferta.module';
import { ReseniaModule } from './resenia/resenia.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [OfertaModule, ContratoModule, AntecedenteModule, ReseniaModule, UsuarioModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
