import { UsuarioEntity } from "../usuario/usuario.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
