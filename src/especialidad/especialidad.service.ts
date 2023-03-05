import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { EspecialidadEntity } from './especialidad.entity';

@Injectable()
export class EspecialidadService {
    constructor(
        @InjectRepository(EspecialidadEntity)
        private readonly especialidadRepository: Repository<EspecialidadEntity>
    ){}

    async findAll(): Promise<EspecialidadEntity[]> {
        return await this.especialidadRepository.find({ relations: [] });
    }

    async findOne(id: string): Promise<EspecialidadEntity> {
        const especialidad: EspecialidadEntity = await this.especialidadRepository.findOne({where: {id}, relations: [] } );
        if (!especialidad)
          throw new BusinessLogicException("The especialidad with the given id was not found", BusinessError.NOT_FOUND);
   
        return especialidad;
    }

    async create(especialidad: EspecialidadEntity): Promise<EspecialidadEntity> {
        return await this.especialidadRepository.save(especialidad);
    }

    async update(id: string, especialidad: EspecialidadEntity): Promise<EspecialidadEntity> {
       const persistedEspecialidad: EspecialidadEntity = await this.especialidadRepository.findOne({where:{id}});
       if (!persistedEspecialidad)
         throw new BusinessLogicException("The especialidad with the given id was not found", BusinessError.NOT_FOUND);
       
       return await this.especialidadRepository.save({...persistedEspecialidad, ...especialidad});
   }

   async delete(id: string) {
        const especialidad: EspecialidadEntity = await this.especialidadRepository.findOne({where:{id}});
        if (!especialidad)
          throw new BusinessLogicException("The especialidad with the given id was not found", BusinessError.NOT_FOUND);
 
        await this.especialidadRepository.remove(especialidad);
    }
}
