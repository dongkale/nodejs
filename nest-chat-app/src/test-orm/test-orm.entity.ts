import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TestOrm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  version: string;
  // Add more properties and methods as needed
}
