/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AntecedenteEntity } from './antecedente.entity';
import { AntecedenteService } from './antecedente.service';
import { AntecedenteController } from './antecedente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AntecedenteEntity])],
  providers: [AntecedenteService],
  controllers: [AntecedenteController]
})
export class AntecedenteModule {}
