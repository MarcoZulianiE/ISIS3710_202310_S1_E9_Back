import { EspecialidadEntity } from 'src/especialidad/especialidad.entity';
import { NecesidadEntity } from 'src/necesidad/necesidad.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    cedula: number;

    @Column()
    contrasenia: string;

    @Column()
    nombre: string;

    @Column()
    correoElectronico: string;

    @Column()
    direccion: string;

    @Column()
    celular: number;

    @Column()
    tipoUsuario: string;

    @OneToMany(() => NecesidadEntity, necesidad => necesidad.usuario)
    necesidades: NecesidadEntity[];

    @OneToMany(() => EspecialidadEntity, especialidad => especialidad.usuario)
    especialidades: NecesidadEntity[];
}
