import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseniaEntity } from 'src/resenia/resenia.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { UsuarioReseniaService } from './usuario-resenia.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, ReseniaEntity])],
  providers: [UsuarioReseniaService]
})
export class UsuarioReseniaModule {}
