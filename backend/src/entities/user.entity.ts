import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Guest' })
  displayName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 'guest' })
  authType: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
