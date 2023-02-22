import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
