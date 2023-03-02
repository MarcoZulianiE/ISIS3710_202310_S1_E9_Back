
import { AntecedenteEntity } from 'src/antecedente/antecedente.entity';
import { ContratoEntity } from 'src/contrato/contrato.entity';
import { EspecialidadEntity } from 'src/especialidad/especialidad.entity';
import { NecesidadEntity } from 'src/necesidad/necesidad.entity';
import { OfertaEntity } from 'src/oferta/oferta.entity';
import { ReseniaEntity } from 'src/resenia/resenia.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
    especialidades: NecesidadEntity[];
    
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
