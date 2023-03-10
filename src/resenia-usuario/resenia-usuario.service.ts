/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException, NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

@Injectable()
export class ReseniaUsuarioService {

    constructor(
        @InjectRepository(ReseniaEntity)
        private readonly reseniaRepository: Repository<ReseniaEntity>,
    
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ) {}

    async addUsuarioResenia(reseniaId: string, usuarioId: string): Promise<ReseniaEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND);
      
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}, relations: ["autor"]})
        if (!resenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND);
    
        resenia.autor = usuario;
        return await this.reseniaRepository.save(resenia);
      }
    
    async findUsuarioByReseniaIdUsuarioId(reseniaId: string, usuarioId: string): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
       
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}, relations: ["autor"]});
        if (!resenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND)
   
        const reseniaUsuario: UsuarioEntity = resenia.autor.id === usuario.id ? resenia.autor : null;
   
        if (!reseniaUsuario)
          throw new BusinessLogicException(PreconditionFailedErrorMessage("resenia","usuario"), BusinessError.PRECONDITION_FAILED)
   
        return reseniaUsuario;
    }

    async findUsuarioByReseniaId(reseniaId: string): Promise<UsuarioEntity> {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}, relations: ["autor"]});
        if (!resenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND)
       
        return resenia.autor;
    }

    async associateUsuarioResenia(reseniaId: string, usuario: UsuarioEntity): Promise<ReseniaEntity> {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}, relations: ["autor"]});
    
        if (!resenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND)
    
        const usuarioEntity: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuario.id}});
        if (!usuarioEntity)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        resenia.autor = usuarioEntity;
        return await this.reseniaRepository.save(resenia);
    }
    
    async deleteUsuarioResenia(reseniaId: string, usuarioId: string){
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)

        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}, relations: ["autor"]});
        if (!resenia)
          throw new BusinessLogicException(NotFoundErrorMessage("resenia"), BusinessError.NOT_FOUND)
    
        const reseniaUsuario: UsuarioEntity = resenia.autor.id === usuario.id ? resenia.autor : null;
    
        if (!reseniaUsuario)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("resenia","usuario"), BusinessError.PRECONDITION_FAILED)
 
        resenia.autor = null;
        await this.reseniaRepository.save(resenia);
    }
}
