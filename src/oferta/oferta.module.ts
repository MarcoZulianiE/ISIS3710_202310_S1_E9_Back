import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { OfertaController } from './oferta.controller';
import { OfertaEntity } from './oferta.entity';
import { OfertaService } from './oferta.service';

@Module({
  imports: [TypeOrmModule.forFeature([OfertaEntity, UsuarioEntity])],
  providers: [OfertaService],
  controllers: [OfertaController]
})
export class OfertaModule {}
