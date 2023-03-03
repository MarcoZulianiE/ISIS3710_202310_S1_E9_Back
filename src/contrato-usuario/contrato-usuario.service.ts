import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ContratoEntity } from '../contrato/contrato.entity';

@Injectable()
export class ContratoUsuarioService {
    constructor(
        @InjectRepository(ContratoEntity)
        private readonly contratoRepository: Repository<ContratoEntity>,

        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ) {}

    async addUsuarioContrato(contratoId: string, usuarioId: string): Promise<ContratoEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}})
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND);

        const contrato: ContratoEntity = await this.contratoRepository.findOne({where: {id: contratoId}, relations: ["oferta", "usuario"]});
        if (!contrato)
          throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND);
    
        contrato.usuario = usuario;
        return await this.contratoRepository.save(contrato);
    }

    async findUsuarioByContratoIdUsuarioId(contratoId: string, usuarioId: string): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
        
        const contrato: ContratoEntity = await this.contratoRepository.findOne({where: {id: contratoId}, relations: ["usuario"]});
        if (!contrato)
          throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND)
       
        const contratoUsuario: UsuarioEntity = contrato.usuario.id === usuario.id ? contrato.usuario : null;
   
        if (!contratoUsuario)
          throw new BusinessLogicException(PreconditionFailedErrorMessage("contrato","usuario"), BusinessError.PRECONDITION_FAILED)
   
        return contratoUsuario;
    }

    async findUsuarioByContratoId(contratoId: string): Promise<UsuarioEntity> {
        const contrato: ContratoEntity = await this.contratoRepository.findOne({where: {id: contratoId}, relations: ["usuario"]});
        if (!contrato)
          throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND)
       
        return contrato.usuario;
    }

    async associateUsuarioContrato(contratoId: string, usuario: UsuarioEntity): Promise<ContratoEntity> {
        const contrato: ContratoEntity = await this.contratoRepository.findOne({where: {id: contratoId}, relations: ["usuario"]});
    
        if (!contrato)
          throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND)
    
        const usuarioEntity: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuario.id}});
        if (!usuarioEntity)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        contrato.usuario = usuarioEntity;
        return await this.contratoRepository.save(contrato);
    }

    async deleteUsuarioContrato(contratoId: string, usuarioId: string){
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)

        const contrato: ContratoEntity = await this.contratoRepository.findOne({where: {id: contratoId}, relations: ["usuario"]});
        if (!contrato)
          throw new BusinessLogicException(NotFoundErrorMessage("contrato"), BusinessError.NOT_FOUND)
    
        const contratoUsuario: UsuarioEntity = contrato.usuario.id === usuario.id ? contrato.usuario : null;
    
        if (!contratoUsuario)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("contrato","usuario"), BusinessError.PRECONDITION_FAILED)
 
        contrato.usuario = null;
        await this.contratoRepository.save(contrato);
    }

}