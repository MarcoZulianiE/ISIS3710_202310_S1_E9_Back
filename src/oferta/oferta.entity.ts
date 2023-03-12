import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContratoEntity } from "../contrato/contrato.entity";
import { HorarioEntity } from "../horario/horario.entity";
import { UsuarioEntity } from "../usuario/usuario.entity";

@Entity()
export class OfertaEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    precio: number;

    @Column()
    disponible: boolean;

    @Column()
    tipoOferta: string;

    @Column()
    fechaInicio: Date;

    @Column()
    fechaFin: Date; 

    @OneToOne( () => ContratoEntity, contrato => contrato.oferta)
    contrato: ContratoEntity;

    @OneToMany( () => HorarioEntity, horario => horario.oferta)
    horarios: HorarioEntity[];

    @ManyToOne(() => UsuarioEntity, usuario => usuario.ofertas)
    @JoinColumn()
    usuario: UsuarioEntity;
}