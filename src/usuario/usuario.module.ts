import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  providers: [UsuarioService, AuthService, JwtService],
  controllers: [UsuarioController],
  exports: [UsuarioService, TypeOrmModule.forFeature([UsuarioEntity])]
})
export class UsuarioModule {}
