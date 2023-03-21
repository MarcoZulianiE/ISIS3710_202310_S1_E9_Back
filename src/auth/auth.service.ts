import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import constants from '../shared/security/constants';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
   constructor(
       private usuarioService: UsuarioService,
       private jwtService: JwtService
   ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user: UsuarioEntity = await this.usuarioService.findByEmail(email)
    if (user && user.contrasenia === password) {
      const { contrasenia, ...result } = user;
      return result;
    }
    return null;
  }

  async login(req: any) {
    const payload = { name: req.email, sub: req.id };
    return {
      token: this.jwtService.sign(payload, { privateKey: constants.JWT_SECRET }),
    };
  }

}