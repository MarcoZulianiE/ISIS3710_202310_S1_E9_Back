import { Module } from '@nestjs/common';
import { UsuarioEspecialidadService } from './usuario-especialidad.service';

@Module({
  providers: [UsuarioEspecialidadService]
})
export class UsuarioEspecialidadModule {}
