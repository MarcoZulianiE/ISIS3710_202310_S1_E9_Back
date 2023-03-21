/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { UsuarioService } from 'src/usuario/usuario.service';
import constants from '../shared/security/constants';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';

@Module({
    imports: [
        UsuarioModule,
        PassportModule,
        JwtModule.register({
          secret: constants.JWT_SECRET,
          signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
        })
      ],
    providers: [AuthService, UsuarioService, JwtService, LocalStrategy, JwtStrategy], 
    exports: [AuthService]
    
})
export class AuthModule {}
