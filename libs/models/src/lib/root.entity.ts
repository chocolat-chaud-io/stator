import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class RootEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @CreateDateColumn({ type: "timestamp" })
  createdAt?: Date

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt?: Date
}
