import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
