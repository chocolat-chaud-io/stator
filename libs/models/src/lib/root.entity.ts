import { PrimaryGeneratedColumn } from "typeorm"

export class RootEntity {
  @PrimaryGeneratedColumn()
  id?: number
}
