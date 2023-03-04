/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AntecedenteEntity } from '../antecedente/antecedente.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Injectable()
export class UsuarioAntecedenteService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    
        @InjectRepository(AntecedenteEntity)
        private readonly antecedenteRepository: Repository<AntecedenteEntity>
    ) {}
    
    async addAntecedenteUsuario(usuarioId: string, antecedenteId: string): Promise<UsuarioEntity> {
        const antecedente: AntecedenteEntity = await this.antecedenteRepository.findOne({where: {id: antecedenteId}});
        if (!antecedente)
          throw new BusinessLogicException(NotFoundErrorMessage("antecedente"), BusinessError.NOT_FOUND);
        
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["necesidades", "especialidades", "antecedentes", "reseniasEscritas", "antecedentes", "antecedentes", "ofertas"]})
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND);
    
        usuario.antecedentes = [...usuario.antecedentes, antecedente];
        return await this.usuarioRepository.save(usuario);
    }

    async findAntecedenteByUsuarioIdAntecedenteId(usuarioId: string, antecedenteId: string): Promise<AntecedenteEntity> {
        const antecedente: AntecedenteEntity = await this.antecedenteRepository.findOne({where: {id: antecedenteId}});
        if (!antecedente)
          throw new BusinessLogicException(NotFoundErrorMessage("antecedente"), BusinessError.NOT_FOUND)
       
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["antecedentes"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
   
        const usuarioAntecedente: AntecedenteEntity = usuario.antecedentes.find(c => c.id === antecedente.id);
   
        if (!usuarioAntecedente)
          throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","antecedente"), BusinessError.PRECONDITION_FAILED)
   
        return usuarioAntecedente;
    }

    async findAntecedentesByUsuarioId(usuarioId: string): Promise<AntecedenteEntity[]> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["antecedentes"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
       
        return usuario.antecedentes;
    }

    async associateAntecedentesUsuario(usuarioId: string, antecedentes: AntecedenteEntity[]): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["antecedentes"]});
    
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        for (let i = 0; i < antecedentes.length; i++) {
          const antecedente: AntecedenteEntity = await this.antecedenteRepository.findOne({where: {id: antecedentes[i].id}});
          if (!antecedente)
            throw new BusinessLogicException(NotFoundErrorMessage("antecedente"), BusinessError.NOT_FOUND)
        }
    
        usuario.antecedentes = antecedentes;
        return await this.usuarioRepository.save(usuario);
    }

    async deleteAntecedenteUsuario(usuarioId: string, antecedenteId: string){
        const antecedente: AntecedenteEntity = await this.antecedenteRepository.findOne({where: {id: antecedenteId}});
        if (!antecedente)
          throw new BusinessLogicException(NotFoundErrorMessage("antecedente"), BusinessError.NOT_FOUND)
    
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["antecedentes"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        const usuarioAntecedente: AntecedenteEntity = usuario.antecedentes.find(c => c.id === antecedente.id);
    
        if (!usuarioAntecedente)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","antecedente"), BusinessError.PRECONDITION_FAILED)
 
        usuario.antecedentes = usuario.antecedentes.filter(c => c.id !== antecedenteId);
        await this.usuarioRepository.save(usuario);
    }  
}