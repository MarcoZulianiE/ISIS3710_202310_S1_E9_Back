import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage } from '../shared/errors/business-errors';
import { OfertaEntity } from './oferta.entity';

@Injectable()
export class OfertaService {
    constructor(
        @InjectRepository(OfertaEntity)
        private readonly ofertaRepository: Repository<OfertaEntity>
    ) {}

    async findAll(): Promise<OfertaEntity[]> {
        return await this.ofertaRepository.find( { relations: ["horarios", "usuario", "contrato"]})
    }

    async findOne(id: string): Promise<OfertaEntity> {
        const oferta: OfertaEntity = await this.ofertaRepository.findOne( {where: {id}, relations: ["horarios", "usuario", "contrato"]})

        if (!oferta) 
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND);

        return oferta
    }

    async create(oferta: OfertaEntity): Promise<OfertaEntity> {
        // TODO: revisar que fecha inicio sea menor que fecha fin
        

        if(oferta.tipoOferta.toLowerCase() != "canguro" && oferta.tipoOferta.toLowerCase() != "acudiente")
            throw new BusinessLogicException("El tipo de oferta debe ser 'canguro' o 'acudiente'", BusinessError.PRECONDITION_FAILED);
        
        return await this.ofertaRepository.save(oferta);
    }

    async update(id: string, oferta: OfertaEntity): Promise<OfertaEntity> {
        const persitedOferta: OfertaEntity = await this.ofertaRepository.findOne( {where:{id}});
        if (!persitedOferta)
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND);
        
        return await this.ofertaRepository.save({...persitedOferta, ...oferta});
    }

    async delete(id: string) {
        const oferta: OfertaEntity = await this.ofertaRepository.findOne( {where: {id}});
        if (!oferta)
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND);
        
        return await this.ofertaRepository.remove(oferta);
    }

}
