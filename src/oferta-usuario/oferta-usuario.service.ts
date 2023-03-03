import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';

@Injectable()
export class OfertaUsuarioService {
    constructor(
        @InjectRepository(OfertaEntity)
        private readonly ofertaRepository: Repository<OfertaEntity>,

        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ) {}

    async addUsuarioOferta(ofertaId: string, usuarioId: string): Promise<OfertaEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}})
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND);

        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}, relations: ["contrato", "horarios", "usuario"]});
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND);
    
        oferta.usuario = usuario;
        return await this.ofertaRepository.save(oferta);
    }

    async findUsuarioByOfertaIdUsuarioId(ofertaId: string, usuarioId: string): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
        
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}, relations: ["usuario"]});
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND)
       
        const ofertaUsuario: UsuarioEntity = oferta.usuario.id === usuario.id ? oferta.usuario : null;
   
        if (!ofertaUsuario)
          throw new BusinessLogicException(PreconditionFailedErrorMessage("oferta","usuario"), BusinessError.PRECONDITION_FAILED)
   
        return ofertaUsuario;
    }

    async findUsuarioByOfertaId(ofertaId: string): Promise<UsuarioEntity> {
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}, relations: ["usuario"]});
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND)
       
        return oferta.usuario;
    }

    async associateUsuarioOferta(ofertaId: string, usuario: UsuarioEntity): Promise<OfertaEntity> {
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}, relations: ["usuario"]});
    
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND)
    
        const usuarioEntity: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuario.id}});
        if (!usuarioEntity)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        oferta.usuario = usuarioEntity;
        return await this.ofertaRepository.save(oferta);
    }

    async deleteUsuarioOferta(ofertaId: string, usuarioId: string){
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)

        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}, relations: ["usuario"]});
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND)
    
        const ofertaUsuario: UsuarioEntity = oferta.usuario.id === usuario.id ? oferta.usuario : null;
    
        if (!ofertaUsuario)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("oferta","usuario"), BusinessError.PRECONDITION_FAILED)
 
        oferta.usuario = null;
        await this.ofertaRepository.save(oferta);
    }

}