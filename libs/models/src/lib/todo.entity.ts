import { Column, Entity } from "typeorm"
import { RootEntity } from "./root.entity"
import { MinLength } from "class-validator";

@Entity()
export class Todo extends RootEntity {
  @Column()
  @MinLength(5, { always: true })
  text: string
}
