/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AntecedenteEntity } from './antecedente.entity';

@Injectable()
export class AntecedenteService {

    constructor(
        @InjectRepository(AntecedenteEntity)
        private readonly antecedenteRepository: Repository<AntecedenteEntity>
    ){}

    async findAll(): Promise<AntecedenteEntity[]> {
        return await this.antecedenteRepository.find({ relations: [] });
    }

    async findOne(id: string): Promise<AntecedenteEntity> {
        const antecedente: AntecedenteEntity = await this.antecedenteRepository.findOne({where: {id}, relations: [] } );
        if (!antecedente)
          throw new BusinessLogicException(NotFoundErrorMessage("antecedente"), BusinessError.NOT_FOUND);
   
        return antecedente;
    }

    async create(antecedente: AntecedenteEntity): Promise<AntecedenteEntity> {
        return await this.antecedenteRepository.save(antecedente);
    }

    async update(id: string, antecedente: AntecedenteEntity): Promise<AntecedenteEntity> {
        const persistedAntecedente: AntecedenteEntity = await this.antecedenteRepository.findOne({where:{id}});
        if (!persistedAntecedente)
          throw new BusinessLogicException(NotFoundErrorMessage("antecedente"), BusinessError.NOT_FOUND);
        
        return await this.antecedenteRepository.save({...persistedAntecedente, ...antecedente});
    }

    async delete(id: string) {
        const antecedente: AntecedenteEntity = await this.antecedenteRepository.findOne({where:{id}});
        if (!antecedente)
          throw new BusinessLogicException(NotFoundErrorMessage("antecedente"), BusinessError.NOT_FOUND);
     
        await this.antecedenteRepository.remove(antecedente);
    }
}
