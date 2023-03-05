import { Module } from '@nestjs/common';
import { EspecialidadService } from './especialidad.service';

@Module({
  providers: [EspecialidadService]
})
export class EspecialidadModule {}
