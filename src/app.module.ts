import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OfertaModule } from './oferta/oferta.module';
import { ContratoModule } from './contrato/contrato.module';

@Module({
  imports: [OfertaModule, ContratoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
