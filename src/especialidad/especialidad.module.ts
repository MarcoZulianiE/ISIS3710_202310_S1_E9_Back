import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecialidadEntity } from './especialidad.entity';
import { EspecialidadService } from './especialidad.service';

@Module({
  imports: [TypeOrmModule.forFeature([EspecialidadEntity])],
  providers: [EspecialidadService]
})
export class EspecialidadModule {}
