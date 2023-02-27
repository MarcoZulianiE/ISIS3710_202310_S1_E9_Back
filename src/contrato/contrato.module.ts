import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoEntity } from './contrato.entity';
import { ContratoService } from './contrato.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContratoEntity])],
  providers: [ContratoService]
})
export class ContratoModule {}
