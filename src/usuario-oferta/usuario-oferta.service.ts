import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { OfertaEntity } from '../oferta/oferta.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Injectable()
export class UsuarioOfertaService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    
        @InjectRepository(OfertaEntity)
        private readonly ofertaRepository: Repository<OfertaEntity>
    ) {}
    
    async addOfertaUsuario(usuarioId: string, ofertaId: string): Promise<UsuarioEntity> {
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}});
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND);
        
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["necesidades", "especialidades", "reseniasRecibidas", "reseniasEscritas", "antecedentes", "contratos", "ofertas"]})
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND);
    
        usuario.ofertas = [...usuario.ofertas, oferta];
        return await this.usuarioRepository.save(usuario);
    }

    async findOfertaByUsuarioIdOfertaId(usuarioId: string, ofertaId: string): Promise<OfertaEntity> {
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}});
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND)
       
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["ofertas"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
   
        const usuarioOferta: OfertaEntity = usuario.ofertas.find(c => c.id === oferta.id);
   
        if (!usuarioOferta)
          throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","oferta"), BusinessError.PRECONDITION_FAILED)
   
        return usuarioOferta;
    }

    async findOfertasByUsuarioId(usuarioId: string): Promise<OfertaEntity[]> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["ofertas"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
       
        return usuario.ofertas;
    }

    async associateOfertasUsuario(usuarioId: string, ofertas: OfertaEntity[]): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["ofertas"]});
    
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        for (let i = 0; i < ofertas.length; i++) {
          const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertas[i].id}});
          if (!oferta)
            throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND)
        }
    
        usuario.ofertas = ofertas;
        return await this.usuarioRepository.save(usuario);
    }

    async deleteOfertaUsuario(usuarioId: string, ofertaId: string){
        const oferta: OfertaEntity = await this.ofertaRepository.findOne({where: {id: ofertaId}});
        if (!oferta)
          throw new BusinessLogicException(NotFoundErrorMessage("oferta"), BusinessError.NOT_FOUND)
    
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["ofertas"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        const usuarioOferta: OfertaEntity = usuario.ofertas.find(c => c.id === oferta.id);
    
        if (!usuarioOferta)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","oferta"), BusinessError.PRECONDITION_FAILED)
 
        usuario.ofertas = usuario.ofertas.filter(c => c.id !== ofertaId);
        await this.usuarioRepository.save(usuario);
    }  
}