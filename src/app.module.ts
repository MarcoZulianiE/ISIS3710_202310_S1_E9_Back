import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntecedenteModule } from './antecedente/antecedente.module';
import { ReseniaModule } from './resenia/resenia.module';

@Module({
  imports: [AntecedenteModule, ReseniaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
