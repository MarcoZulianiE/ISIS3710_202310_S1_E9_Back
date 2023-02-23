import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class AntecedenteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tipo: string;

  @Column()
  description: string;
}
