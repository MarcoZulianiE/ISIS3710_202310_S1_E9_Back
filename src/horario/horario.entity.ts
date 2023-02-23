import { OfertaEntity } from "src/oferta/oferta.entity";
import { Column, ColumnTypeUndefinedError, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

export class HorarioEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    horaInicio: Timestamp;

    @Column()
    horaFin: Timestamp;

    @Column()
    dia: Dia;

    @ManyToOne( () => OfertaEntity, oferta => oferta.horarios)
    oferta: OfertaEntity;
}

export enum Dia{
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes"
}
