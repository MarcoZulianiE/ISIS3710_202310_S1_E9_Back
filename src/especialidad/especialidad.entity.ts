import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "../usuario/usuario.entity";

@Entity()
export class EspecialidadEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tipo: string;

    @Column()
    descripcion: string;

    @ManyToOne( () => UsuarioEntity, usuario => usuario.especialidades)
    usuario: UsuarioEntity;
}
