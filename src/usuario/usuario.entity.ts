/* eslint-disable prettier/prettier */
import AntecedenteEntity from 'src/antecedente/antecedente.entity';
import { ReseniaEntity } from 'src/resenia/resenia.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';

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

    @OneToMany(() => ReseniaEntity, resenia => resenia.receptor)
    reseniasRecibidas: ReseniaEntity[];

    @OneToMany(() => ReseniaEntity, resenia => resenia.autor)
    reseniasEscritas: ReseniaEntity[];

    @OneToMany(() => AntecedenteEntity, antecedente => antecedente.usuario)
    antecedentes: AntecedenteEntity[];
}
