/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Entity()
export class AntecedenteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tipo: string;

  @Column()
  description: string;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.antecedentes)
  usuario: UsuarioEntity;
}
