import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage } from '../shared/errors/business-errors';
import { HorarioEntity } from './horario.entity';

@Injectable()
export class HorarioService {
    constructor(
        @InjectRepository(HorarioEntity)
        private readonly horarioRepository: Repository<HorarioEntity>
    ) {}

    async findAll(): Promise<HorarioEntity[]> {
        return await this.horarioRepository.find( { relations: ["oferta"]})
    }

    async findOne(id: string): Promise<HorarioEntity> {
        const horario: HorarioEntity = await this.horarioRepository.findOne( {where: {id}, relations: ["oferta"]})

        if (!horario) 
            throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND);

        return horario
    }

    async create(horario: HorarioEntity): Promise<HorarioEntity> {
        
        if(horario.horaFin.getTime() <= horario.horaInicio.getTime())
            throw new BusinessLogicException("La hora de inicio debe ser menor que la hora de fin", BusinessError.PRECONDITION_FAILED);
        
        return await this.horarioRepository.save(horario);
    }

    async update(id: string, horario: HorarioEntity): Promise<HorarioEntity> {
        const persitedHorario: HorarioEntity = await this.horarioRepository.findOne( {where:{id}});
        if (!persitedHorario)
            throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND);
        
        return await this.horarioRepository.save({...persitedHorario, ...horario});
    }

    async delete(id: string) {
        const horario: HorarioEntity = await this.horarioRepository.findOne( {where: {id}});
        if (!horario)
            throw new BusinessLogicException(NotFoundErrorMessage("horario"), BusinessError.NOT_FOUND);
        
        return await this.horarioRepository.remove(horario);
    }

}
