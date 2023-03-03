import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ContratoEntity } from '../contrato/contrato.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Injectable()
export class UsuarioContratoService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    
        @InjectRepository(ContratoEntity)
        private readonly contratoRepository: Repository<ContratoEntity>
    ) {}
    
    async addContratoUsuario(usuarioId: string, contratoId: string): Promise<UsuarioEntity> {
        const contrato: ContratoEntity = await this.contratoRepository.findOne({where: {id: contratoId}});
        if (!contrato)
          throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND);
        
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["necesidades", "especialidades", "reseniasRecibidas", "reseniasEscritas", "antecedentes", "contratos", "ofertas"]})
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND);
    
        usuario.contratos = [...usuario.contratos, contrato];
        return await this.usuarioRepository.save(usuario);
    }

    async findContratoByUsuarioIdContratoId(usuarioId: string, contratoId: string): Promise<ContratoEntity> {
        const contrato: ContratoEntity = await this.contratoRepository.findOne({where: {id: contratoId}});
        if (!contrato)
          throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND)
       
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["contratos"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
   
        const usuarioContrato: ContratoEntity = usuario.contratos.find(c => c.id === contrato.id);
   
        if (!usuarioContrato)
          throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","contrato"), BusinessError.PRECONDITION_FAILED)
   
        return usuarioContrato;
    }

    async findContratosByUsuarioId(usuarioId: string): Promise<ContratoEntity[]> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["contratos"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
       
        return usuario.contratos;
    }

    async associateContratosUsuario(usuarioId: string, contratos: ContratoEntity[]): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["contratos"]});
    
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        for (let i = 0; i < contratos.length; i++) {
          const contrato: ContratoEntity = await this.contratoRepository.findOne({where: {id: contratos[i].id}});
          if (!contrato)
            throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND)
        }
    
        usuario.contratos = contratos;
        return await this.usuarioRepository.save(usuario);
    }

    async deleteContratoUsuario(usuarioId: string, contratoId: string){
        const contrato: ContratoEntity = await this.contratoRepository.findOne({where: {id: contratoId}});
        if (!contrato)
          throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND)
    
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["contratos"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        const usuarioContrato: ContratoEntity = usuario.contratos.find(c => c.id === contrato.id);
    
        if (!usuarioContrato)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","contrato"), BusinessError.PRECONDITION_FAILED)
 
        usuario.contratos = usuario.contratos.filter(c => c.id !== contratoId);
        await this.usuarioRepository.save(usuario);
    }  
}