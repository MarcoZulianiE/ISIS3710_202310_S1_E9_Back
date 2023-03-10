import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OfertaEntity } from "../oferta/oferta.entity";
import { UsuarioEntity } from "../usuario/usuario.entity";

@Entity()
export class ContratoEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    fecha:Date; 

    @OneToOne(()=> OfertaEntity, oferta => oferta.contrato)
    @JoinColumn()
    oferta: OfertaEntity;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.contratos)
    usuario: UsuarioEntity;

}