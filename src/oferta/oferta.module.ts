import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaEntity } from './oferta.entity';
import { OfertaService } from './oferta.service';

@Module({
  imports: [TypeOrmModule.forFeature([OfertaEntity])],
  providers: [OfertaService]
})
export class OfertaModule {}
