import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class RegistryDates {
  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
