
import { AntecedenteEntity } from 'src/antecedente/antecedente.entity';
import { EspecialidadEntity } from 'src/especialidad/especialidad.entity';
import { NecesidadEntity } from 'src/necesidad/necesidad.entity';
import { ReseniaEntity } from 'src/resenia/resenia.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
    
    @OneToMany(() => ReseniaEntity, resenia => resenia.receptor)
    reseniasRecibidas: ReseniaEntity[];

    @OneToMany(() => ReseniaEntity, resenia => resenia.autor)
    reseniasEscritas: ReseniaEntity[];

    @OneToMany(() => AntecedenteEntity, antecedente => antecedente.usuario)
    antecedentes: AntecedenteEntity[];
}
