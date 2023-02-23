import { UsuarioEntity } from "src/usuario/usuario.entity";
import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class EspecialidadEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tipo: Propiedad;

    @Column()
    descripcion: string;

    @ManyToOne( () => UsuarioEntity, usuario => usuario.especialidades)
    usuario: UsuarioEntity;
}

export enum Propiedad {
    "Educativa", 
    "Salud",
    "Comportamental"
}
