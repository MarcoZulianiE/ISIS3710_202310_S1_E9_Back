
import { Column, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OfertaEntity } from "../oferta/oferta.entity";
import { UsuarioEntity } from "../usuario/usuario.entity";

@Entity()
export class ContratoEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    fecha:Date; 

    @OneToOne(()=> OfertaEntity, oferta => oferta.contrato)
    oferta: OfertaEntity;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.contratos)
    usuario: UsuarioEntity;

}