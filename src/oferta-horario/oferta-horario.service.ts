import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioEntity } from '../horario/horario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

@Injectable()
export class OfertaHorarioService {
    constructor(
        @InjectRepository(OfertaEntity)
        private readonly ofertaRepository: Repository<OfertaEntity>,

        @InjectRepository(HorarioEntity)
        private readonly horarioRepository: Repository<HorarioEntity>,
    ) {}

    async addHorarioToOferta(ofertaId: string, horarioId: string): Promise<OfertaEntity> {
        const horario = await this.horarioRepository.findOne({where: {id: horarioId}})
        if(!horario)
            throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND);

        const oferta = await this.ofertaRepository.findOne({where: {id: ofertaId}, relations: ["horarios", "usuario", "contrato"]});
        if(!oferta)
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND);

        oferta.horarios = [...oferta.horarios, horario];
        return await this.ofertaRepository.save(oferta);
    }

    async findHorarioByOfertaId(ofertaId: string, horarioId: string): Promise<HorarioEntity> {
        const horario: HorarioEntity = await this.horarioRepository.findOne({where: {id: horarioId}});
        if(!horario)
            throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND);
        
        const oferta = await this.ofertaRepository.findOne({where: {id: ofertaId}, relations: ["horarios", "usuario", "contrato"]});
        if(!oferta)
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND); 
            
        const ofertaHorario: HorarioEntity = oferta.horarios.find(h => h.id === horarioId);

        if(!ofertaHorario)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("oferta", "horario"), BusinessError.PRECONDITION_FAILED);
        
        return ofertaHorario;

    }

    async findHorariosByOfertaId(ofertaId: string): Promise<HorarioEntity[]> {
        const oferta = await this.ofertaRepository.findOne({where: {id: ofertaId}, relations: ["horarios"]});
        if(!oferta)
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND); 
            
        return oferta.horarios;
    }

    async associateHorariosOferta(ofertaId: string, horarios: HorarioEntity[]): Promise<OfertaEntity> {
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}, relations: ["horarios"]});

        if(!oferta)
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND);

        for(let i = 0; i < horarios.length; i++) {

            const horario = await this.horarioRepository.findOne({where: {id: horarios[i].id}});
            if(!horario)
                throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND);
        }

        oferta.horarios = horarios;
        return await this.ofertaRepository.save(oferta);
    }
    
    async deleteHorarioOferta(ofertaId: string, horarioId: string): Promise<OfertaEntity> {
        const horario = await this.horarioRepository.findOne({where: {id: horarioId}});
        if(!horario)
            throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND);

        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}, relations: ["horarios"]});
        if(!oferta)
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND);
        
        
        const ofertaHorario: HorarioEntity = oferta.horarios.find(h => h.id === horarioId);

        if(!ofertaHorario)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("oferta", "horario"), BusinessError.PRECONDITION_FAILED);
        
        oferta.horarios = oferta.horarios.filter(h => h.id !== horarioId);
        return await this.ofertaRepository.save(oferta);
    }

    
}
