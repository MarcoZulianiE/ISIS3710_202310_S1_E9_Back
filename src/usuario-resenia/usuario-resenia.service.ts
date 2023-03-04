/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Injectable()
export class UsuarioReseniaService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    
        @InjectRepository(ReseniaEntity)
        private readonly reseniaRepository: Repository<ReseniaEntity>
    ) {}
    
    async addReseniaUsuario(usuarioId: string, reseniaId: string): Promise<UsuarioEntity> {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}});
        if (!resenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND);
        
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["necesidades", "especialidades", "reseniasRecibidas", "reseniasEscritas", "antecedentes", "contratos", "ofertas"]})
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND);
    
        usuario.reseniasRecibidas = [...usuario.reseniasRecibidas, resenia];
        return await this.usuarioRepository.save(usuario);
    }

    async findReseniaByUsuarioIdReseniaId(usuarioId: string, reseniaId: string): Promise<ReseniaEntity> {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}});
        if (!resenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND)
       
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["reseniasRecibidas"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
   
        const usuarioResenia: ReseniaEntity = usuario.reseniasRecibidas.find(resenia => resenia.id === resenia.id);
   
        if (!usuarioResenia)
          throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","resenia"), BusinessError.PRECONDITION_FAILED)
   
        return usuarioResenia;
    }

    async findReseniasByUsuarioId(usuarioId: string): Promise<ReseniaEntity[]> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["reseniasRecibidas"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
       
        return usuario.reseniasRecibidas;
    }

    async associateReseniasUsuario(usuarioId: string, resenias: ReseniaEntity[]): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["reseniasRecibidas"]});
    
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        for (let i = 0; i < resenias.length; i++) {
          const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: resenias[i].id}});
          if (!resenia)
            throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND)
        }
    
        usuario.reseniasRecibidas = resenias;
        return await this.usuarioRepository.save(usuario);
    }

    async deleteReseniaUsuario(usuarioId: string, reseniaId: string){
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}});
        if (!resenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND)
    
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["reseniasRecibidas"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        const usuarioResenia: ReseniaEntity = usuario.reseniasRecibidas.find(resenia => resenia.id === resenia.id);
    
        if (!usuarioResenia)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","resenia"), BusinessError.PRECONDITION_FAILED)
 
        usuario.reseniasRecibidas = usuario.reseniasRecibidas.filter(c => c.id !== reseniaId);
        await this.usuarioRepository.save(usuario);
    }  
}