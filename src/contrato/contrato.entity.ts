import { OfertaEntity } from "src/oferta/oferta.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export class ContratoEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    fecha:Date; 

    @OneToOne(()=> OfertaEntity, oferta => oferta.contrato)
    oferta: OfertaEntity;

}