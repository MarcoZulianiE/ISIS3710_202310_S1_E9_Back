import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioEntity } from './horario.entity';
import { HorarioService } from './horario.service';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioEntity])],
  providers: [HorarioService]
})
export class HorarioModule {}
