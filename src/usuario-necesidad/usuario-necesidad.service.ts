import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NecesidadEntity } from '../necesidad/necesidad.entity';
import { BusinessLogicException, BusinessError, PreconditionFailedErrorMessage, NotFoundErrorMessage } from '../shared/errors/business-errors';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioNecesidadService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    
        @InjectRepository(NecesidadEntity)
        private readonly necesidadRepository: Repository<NecesidadEntity>
    ) {}

    async addNecesidadUsuario(usuarioId: string, necesidadId: string): Promise<UsuarioEntity> {
        const necesidad: NecesidadEntity = await this.necesidadRepository.findOne({where: {id: necesidadId}});
        if (!necesidad)
          throw new BusinessLogicException(NotFoundErrorMessage("necesidad"), BusinessError.NOT_FOUND);
      
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["necesidades", "especialidades", "reseniasEscritas", "reseniasRecibidas", "ofertas"]})
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND);
    
        usuario.necesidades = [...usuario.necesidades, necesidad];
        return await this.usuarioRepository.save(usuario);
    }

    async findNecesidadByUsuarioIdNecesidadId(usuarioId: string, necesidadId: string): Promise<NecesidadEntity> {
        const necesidad: NecesidadEntity = await this.necesidadRepository.findOne({where: {id: necesidadId}});
        if (!necesidad)
          throw new BusinessLogicException(NotFoundErrorMessage("necesidad"), BusinessError.NOT_FOUND)
       
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["necesidades"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
   
        const usuarioNecesidad: NecesidadEntity = usuario.necesidades.find(e => e.id === necesidad.id);
   
        if (!usuarioNecesidad)
          throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","necesidad"), BusinessError.PRECONDITION_FAILED)
   
        return usuarioNecesidad;
    }    

    async findNecesidadesByUsuarioId(usuarioId: string): Promise<NecesidadEntity[]> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["necesidades"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
       
        return usuario.necesidades;
    }

    async associateNecesidadesUsuario(usuarioId: string, necesidades: NecesidadEntity[]): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["necesidades"]});
    
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        for (let i = 0; i < necesidades.length; i++) {
          const necesidad: NecesidadEntity = await this.necesidadRepository.findOne({where: {id: necesidades[i].id}});
          if (!necesidad)
            throw new BusinessLogicException(NotFoundErrorMessage("necesidad"), BusinessError.NOT_FOUND)
        }
    
        usuario.necesidades = necesidades;
        return await this.usuarioRepository.save(usuario);
    }

    async deleteNecesidadUsuario(usuarioId: string, necesidadId: string){
        const necesidad: NecesidadEntity = await this.necesidadRepository.findOne({where: {id: necesidadId}});
        if (!necesidad)
          throw new BusinessLogicException(NotFoundErrorMessage("necesidad"), BusinessError.NOT_FOUND)
    
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["necesidades"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        const usuarioNecesidad: NecesidadEntity = usuario.necesidades.find(e => e.id === necesidad.id);
    
        if (!usuarioNecesidad)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","necesidad"), BusinessError.PRECONDITION_FAILED)
 
        usuario.necesidades = usuario.necesidades.filter(e => e.id !== necesidadId);
        await this.usuarioRepository.save(usuario);
    }  
}
