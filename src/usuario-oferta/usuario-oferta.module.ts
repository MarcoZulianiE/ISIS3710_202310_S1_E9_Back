import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaEntity } from 'src/oferta/oferta.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { UsuarioOfertaService } from './usuario-oferta.service';
import { UsuarioOfertaController } from './usuario-oferta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, OfertaEntity])],
  providers: [UsuarioOfertaService],
  controllers: [UsuarioOfertaController]
})
export class UsuarioOfertaModule {}
