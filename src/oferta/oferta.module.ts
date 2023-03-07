import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaEntity } from './oferta.entity';
import { OfertaService } from './oferta.service';
import { OfertaController } from './oferta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OfertaEntity])],
  providers: [OfertaService],
  controllers: [OfertaController]
})
export class OfertaModule {}
