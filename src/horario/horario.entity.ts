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
    dia: string;

    @ManyToOne( () => OfertaEntity, oferta => oferta.horarios)
    @JoinColumn()
    oferta: OfertaEntity;
}
