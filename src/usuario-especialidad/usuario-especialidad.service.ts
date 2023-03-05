import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EspecialidadEntity } from '../especialidad/especialidad.entity';
import { BusinessLogicException, BusinessError, PreconditionFailedErrorMessage, NotFoundErrorMessage } from '../shared/errors/business-errors';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioEspecialidadService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    
        @InjectRepository(EspecialidadEntity)
        private readonly especialidadRepository: Repository<EspecialidadEntity>
    ) {}

    async addEspecialidadUsuario(usuarioId: string, especialidadId: string): Promise<UsuarioEntity> {
        const especialidad: EspecialidadEntity = await this.especialidadRepository.findOne({where: {id: especialidadId}});
        if (!especialidad)
          throw new BusinessLogicException(NotFoundErrorMessage("especialidad"), BusinessError.NOT_FOUND);
      
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["necesidades", "especialidades", "reseniasEscritas", "reseniasRecibidas", "ofertas"]})
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND);
    
        usuario.especialidades = [...usuario.especialidades, especialidad];
        return await this.usuarioRepository.save(usuario);
    }

    async findEspecialidadByUsuarioIdEspecialidadId(usuarioId: string, especialidadId: string): Promise<EspecialidadEntity> {
        const especialidad: EspecialidadEntity = await this.especialidadRepository.findOne({where: {id: especialidadId}});
        if (!especialidad)
          throw new BusinessLogicException(NotFoundErrorMessage("especialidad"), BusinessError.NOT_FOUND)
       
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["especialidades"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
   
        const usuarioEspecialidad: EspecialidadEntity = usuario.especialidades.find(e => e.id === especialidad.id);
   
        if (!usuarioEspecialidad)
          throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","especialidad"), BusinessError.PRECONDITION_FAILED)
   
        return usuarioEspecialidad;
    }    

    async findEspecialidadesByUsuarioId(usuarioId: string): Promise<EspecialidadEntity[]> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["especialidades"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
       
        return usuario.especialidades;
    }

    async associateEspecialidadesUsuario(usuarioId: string, especialidades: EspecialidadEntity[]): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["especialidades"]});
    
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        for (let i = 0; i < especialidades.length; i++) {
          const especialidad: EspecialidadEntity = await this.especialidadRepository.findOne({where: {id: especialidades[i].id}});
          if (!especialidad)
            throw new BusinessLogicException(NotFoundErrorMessage("especialidad"), BusinessError.NOT_FOUND)
        }
    
        usuario.especialidades = especialidades;
        return await this.usuarioRepository.save(usuario);
    }

    async deleteEspecialidadUsuario(usuarioId: string, especialidadId: string){
        const especialidad: EspecialidadEntity = await this.especialidadRepository.findOne({where: {id: especialidadId}});
        if (!especialidad)
          throw new BusinessLogicException(NotFoundErrorMessage("especialidad"), BusinessError.NOT_FOUND)
    
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["especialidades"]});
        if (!usuario)
          throw new BusinessLogicException(NotFoundErrorMessage("usuario"), BusinessError.NOT_FOUND)
    
        const usuarioEspecialidad: EspecialidadEntity = usuario.especialidades.find(e => e.id === especialidad.id);
    
        if (!usuarioEspecialidad)
            throw new BusinessLogicException(PreconditionFailedErrorMessage("usuario","especialidad"), BusinessError.PRECONDITION_FAILED)
 
        usuario.especialidades = usuario.especialidades.filter(e => e.id !== especialidadId);
        await this.usuarioRepository.save(usuario);
    }  
}
