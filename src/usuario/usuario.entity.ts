/* eslint-disable prettier/prettier */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AntecedenteEntity } from '../antecedente/antecedente.entity';
import { ContratoEntity } from '../contrato/contrato.entity';
import { EspecialidadEntity } from '../especialidad/especialidad.entity';
import { NecesidadEntity } from '../necesidad/necesidad.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { ReseniaEntity } from '../resenia/resenia.entity';

@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
    especialidades: EspecialidadEntity[];
    
    @OneToMany(() => ReseniaEntity, resenia => resenia.receptor)
    reseniasRecibidas: ReseniaEntity[];

    @OneToMany(() => ReseniaEntity, resenia => resenia.autor)
    reseniasEscritas: ReseniaEntity[];

    @OneToMany(() => AntecedenteEntity, antecedente => antecedente.usuario)
    antecedentes: AntecedenteEntity[];

    @OneToMany(() => ContratoEntity, contrato => contrato.usuario)
    contratos: ContratoEntity[];

    @OneToMany(() => OfertaEntity, oferta => oferta.usuario)
    ofertas: OfertaEntity[];
}
