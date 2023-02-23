import { ContratoEntity } from "src/contrato/contrato.entity";
import { HorarioEntity } from "src/horario/horario.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export class OfertaEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    precio: number;

    @Column()
    disponible: boolean;

    @Column()
    tipoOferta: TipoO;

    @Column()
    fechaInicio: Date;

    @Column()
    fechaFin: Date; 

    @OneToOne( () => ContratoEntity, contrato => contrato.oferta)
    @JoinColumn()
    contrato: ContratoEntity;

    @OneToMany( () => HorarioEntity, horario => horario.oferta)
    horarios: HorarioEntity;
}


export enum TipoO {
    "Canguro", 
    "Acudiente",
}