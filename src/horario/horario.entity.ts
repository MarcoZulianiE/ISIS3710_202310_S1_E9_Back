import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OfertaEntity } from "../oferta/oferta.entity";

@Entity()
export class HorarioEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    horaInicio: Date;

    @Column()
    horaFin: Date;

    @Column()
    dia: string;

    @ManyToOne( () => OfertaEntity, oferta => oferta.horarios)
    @JoinColumn()
    oferta: OfertaEntity;
}
