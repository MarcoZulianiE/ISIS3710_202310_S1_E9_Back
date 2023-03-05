import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { NecesidadEntity } from './necesidad.entity';

@Injectable()
export class NecesidadService {
    constructor(
        @InjectRepository(NecesidadEntity)
        private readonly necesidadRepository: Repository<NecesidadEntity>
    ){}

    async findAll(): Promise<NecesidadEntity[]> {
        return await this.necesidadRepository.find({ relations: [] });
    }

    async findOne(id: string): Promise<NecesidadEntity> {
        const necesidad: NecesidadEntity = await this.necesidadRepository.findOne({where: {id}, relations: [] } );
        if (!necesidad)
          throw new BusinessLogicException("The necesidad with the given id was not found", BusinessError.NOT_FOUND);
   
        return necesidad;
    }

    async create(necesidad: NecesidadEntity): Promise<NecesidadEntity> {
        return await this.necesidadRepository.save(necesidad);
    }

    async update(id: string, necesidad: NecesidadEntity): Promise<NecesidadEntity> {
       const persistedNecesidad: NecesidadEntity = await this.necesidadRepository.findOne({where:{id}});
       if (!persistedNecesidad)
         throw new BusinessLogicException("The necesidad with the given id was not found", BusinessError.NOT_FOUND);
       
       return await this.necesidadRepository.save({...persistedNecesidad, ...necesidad});
   }

   async delete(id: string) {
        const necesidad: NecesidadEntity = await this.necesidadRepository.findOne({where:{id}});
        if (!necesidad)
          throw new BusinessLogicException("The necesidad with the given id was not found", BusinessError.NOT_FOUND);
 
        await this.necesidadRepository.remove(necesidad);
    }
}
