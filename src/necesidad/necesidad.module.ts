import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NecesidadEntity } from './necesidad.entity';
import { NecesidadService } from './necesidad.service';

@Module({
    imports: [TypeOrmModule.forFeature([NecesidadEntity])],
    providers: [NecesidadService]
})
export class NecesidadModule {}
