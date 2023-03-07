import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfertaEntity } from '../oferta/oferta.entity';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage } from '../shared/errors/business-errors';
import { ContratoEntity } from './contrato.entity';

@Injectable()
export class ContratoService {
    constructor(
        @InjectRepository(ContratoEntity)
        private readonly contratoRepository: Repository<ContratoEntity>,
        @InjectRepository(OfertaEntity)
        private readonly ofertaRepository: Repository<OfertaEntity>
    ){}

    async findAll(): Promise<ContratoEntity[]> {
        return await this.contratoRepository.find( { relations: ["usuario", "oferta"]});
    }

    async findOne(id: string): Promise<ContratoEntity> {
        const contrato: ContratoEntity = await this.contratoRepository.findOne({ where: {id}, relations: ["usuario", "oferta"]});
        if(!contrato)
            throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND);
        return contrato;
    }

    async create(contrato: ContratoEntity): Promise<ContratoEntity> {
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: contrato.oferta.id}});
        if(!oferta)
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND);
        contrato.oferta = oferta;
        return await this.contratoRepository.save(contrato);
    }

    async update(id: string, contrato:ContratoEntity): Promise<ContratoEntity> {
        const persistedContrato: ContratoEntity = await this.contratoRepository.findOne({where: {id}});
        if(!persistedContrato)
            throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND);
        return await this.contratoRepository.save({...persistedContrato, ...contrato});
    }

    async delete(id: string) {
        const contrato: ContratoEntity = await this.contratoRepository.findOne({where: {id}});
        if(!contrato)
            throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND);
        await this.contratoRepository.remove(contrato);       
    }
}
