import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class RegistryDates {
  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
