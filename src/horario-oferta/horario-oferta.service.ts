/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioEntity } from '../horario/horario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

@Injectable()
export class HorarioOfertaService {
    constructor(
        @InjectRepository(HorarioEntity)
        private readonly horarioRepository: Repository<HorarioEntity>,
     
        @InjectRepository(OfertaEntity)
        private readonly ofertaRepository: Repository<OfertaEntity>
    ) {}

    async addOfertaHorario(horarioId: string, ofertaId: string): Promise<HorarioEntity> {
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}});
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND);
       
        const horario: HorarioEntity = await this.horarioRepository.findOne({where: {id: horarioId}, relations: ["oferta"]}) 
        if (!horario)
          throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND);
     
        horario.oferta = oferta;
        return await this.horarioRepository.save(horario);
      }
     
    async findOfertaByHorarioIdOfertaId(horarioId: string, ofertaId: string): Promise<OfertaEntity> {
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}});
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND)
        
        const horario: HorarioEntity = await this.horarioRepository.findOne({where: {id: horarioId}, relations: ["oferta"]}); 
        if (!horario)
          throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND)
    
        const horarioOferta: OfertaEntity = horario.oferta.id === oferta.id ? horario.oferta : null;
    
        if (!horarioOferta)
          throw new BusinessLogicException(PreconditionFailedErrorMessage("horario", "oferta"), BusinessError.PRECONDITION_FAILED)
    
        return horarioOferta;
    }
     
    async findOfertasByHorarioId(horarioId: string): Promise<OfertaEntity> {
        const horario: HorarioEntity = await this.horarioRepository.findOne({where: {id: horarioId}, relations: ["oferta"]});
        if (!horario)
          throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND)
        
        return horario.oferta;
    }
     
    async associateOfertaHorario(horarioId: string, oferta: OfertaEntity): Promise<HorarioEntity> {
        const horario: HorarioEntity = await this.horarioRepository.findOne({where: {id: horarioId}, relations: ["oferta"]});
     
        if (!horario)
          throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND)
    
        const existingOferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: oferta.id}});
        if (!existingOferta)
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND)
     
        horario.oferta = existingOferta;
        return await this.horarioRepository.save(horario);
      }
     
    async deleteOfertaHorario(horarioId: string, ofertaId: string){
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}});
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND)
     
        const horario: HorarioEntity = await this.horarioRepository.findOne({where: {id: horarioId}, relations: ["oferta"]});
        
        if (!horario)
          throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND)
        
        const horarioOferta: OfertaEntity = horario.oferta.id === oferta.id ? horario.oferta : null;

        if (!horarioOferta)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("horario", "oferta"), BusinessError.PRECONDITION_FAILED)

        horario.oferta = null;
        await this.horarioRepository.save(horario);
    }   
}
