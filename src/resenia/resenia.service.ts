/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ReseniaEntity } from './resenia.entity';

@Injectable()
export class ReseniaService {

    constructor(
        @InjectRepository(ReseniaEntity)
        private readonly reseniaRepository: Repository<ReseniaEntity>
    ){}

    async findAll(): Promise<ReseniaEntity[]> {
        return await this.reseniaRepository.find({ relations: ["autor"] });
    }

    async findOne(id: string): Promise<ReseniaEntity> {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id}, relations: ["autor"] } );
        if (!resenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND);
   
        return resenia;
    }

    async create(resenia: ReseniaEntity): Promise<ReseniaEntity> {
        return await this.reseniaRepository.save(resenia);
    }

    async update(id: string, resenia: ReseniaEntity): Promise<ReseniaEntity> {
        const persistedResenia: ReseniaEntity = await this.reseniaRepository.findOne({where:{id}});
        if (!persistedResenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND);
        
        return await this.reseniaRepository.save({...persistedResenia, ...resenia});
    }
    
    async delete(id: string) {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where:{id}});
        if (!resenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND);
     
        await this.reseniaRepository.remove(resenia);
    }
}
