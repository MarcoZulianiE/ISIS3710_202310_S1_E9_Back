import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "../usuario/usuario.entity";

@Entity()
export class NecesidadEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tipo: string;

    @Column()
    descripcion: string;

    @ManyToOne( () => UsuarioEntity, usuario => usuario.necesidades)
    usuario: UsuarioEntity;

}