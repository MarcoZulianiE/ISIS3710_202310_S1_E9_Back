/* eslint-disable prettier/prettier */
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
