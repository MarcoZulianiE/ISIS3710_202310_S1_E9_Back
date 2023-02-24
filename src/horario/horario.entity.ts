import { OfertaEntity } from "src/oferta/oferta.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class HorarioEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    horaInicio: Date;

    @Column()
    horaFin: Date;

    @Column()
    dia: Dia;

    @ManyToOne( () => OfertaEntity, oferta => oferta.horarios)
    @JoinColumn()
    oferta: OfertaEntity;
}

export enum Dia{
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes", 
    "Sabado",
    "Domingo"
}
