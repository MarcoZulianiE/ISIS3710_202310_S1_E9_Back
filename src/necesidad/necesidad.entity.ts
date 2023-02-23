import { UsuarioEntity } from "src/usuario/usuario.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NecesidadEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tipo: Propiedad;

    @Column()
    descripcion: string;

    @ManyToOne( () => UsuarioEntity, usuario => usuario.necesidades)
    usuario: UsuarioEntity;

}

export enum Propiedad {
    "Educativa", 
    "Salud",
    "Comportamental"
}
