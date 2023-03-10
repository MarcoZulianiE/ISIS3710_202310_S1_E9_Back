import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecialidadEntity } from './especialidad.entity';
import { EspecialidadService } from './especialidad.service';
import { EspecialidadController } from './especialidad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EspecialidadEntity])],
  providers: [EspecialidadService]
})
export class EspecialidadModule {}
