import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { ReseniaUsuarioService } from './resenia-usuario.service';
import { ReseniaUsuarioController } from './resenia-usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReseniaEntity, UsuarioEntity])],
  providers: [ReseniaUsuarioService],
  controllers: [ReseniaUsuarioController]
})
export class ReseniaUsuarioModule {}
