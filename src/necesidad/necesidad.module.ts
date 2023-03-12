import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NecesidadController } from './necesidad.controller';
import { NecesidadEntity } from './necesidad.entity';
import { NecesidadService } from './necesidad.service';

@Module({
    imports: [TypeOrmModule.forFeature([NecesidadEntity])],
    providers: [NecesidadService],
    controllers: [NecesidadController]
})
export class NecesidadModule {}
