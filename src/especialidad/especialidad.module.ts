import { Module } from '@nestjs/common';
import { EspecialidadService } from './especialidad.service';
import { EspecialidadController } from './especialidad.controller';

@Module({
  providers: [EspecialidadService]
})
export class EspecialidadModule {}
