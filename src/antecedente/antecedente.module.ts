/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AntecedenteEntity } from './antecedente.entity';
import { AntecedenteService } from './antecedente.service';

@Module({
  imports: [TypeOrmModule.forFeature([AntecedenteEntity])],
  providers: [AntecedenteService]
})
export class AntecedenteModule {}
