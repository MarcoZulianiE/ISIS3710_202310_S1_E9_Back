import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { OfertaEntity } from 'src/oferta/oferta.entity';
import { OfertaUsuarioService } from './oferta-usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([OfertaEntity, UsuarioEntity])],
  providers: [OfertaUsuarioService]
})
export class OfertaUsuarioModule {}
