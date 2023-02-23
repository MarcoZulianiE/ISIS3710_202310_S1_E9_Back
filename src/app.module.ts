import { Module } from '@nestjs/common';
import { AntecedenteModule } from './antecedente/antecedente.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContratoModule } from './contrato/contrato.module';
import { OfertaModule } from './oferta/oferta.module';
import { ReseniaModule } from './resenia/resenia.module';

@Module({
  imports: [OfertaModule, ContratoModule, AntecedenteModule, ReseniaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
