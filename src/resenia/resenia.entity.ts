/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Entity()
export class ReseniaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  calificacion: number;

  @Column()
  descripcion: string;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.reseniasRecibidas)
  receptor: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.reseniasEscritas)
  autor: UsuarioEntity;
}
