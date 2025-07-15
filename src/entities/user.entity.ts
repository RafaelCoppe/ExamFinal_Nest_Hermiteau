import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  OneToMany,
} from "typeorm";
import { Game } from "./game.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  last_name: string;

  @Column()
  first_name: string;

  @Column({ default: false })
  is_active: boolean;

  @Generated("uuid")
  @Column({ unique: true, nullable: true })
  validation_code: string | null;

  @Column({ default: false })
  is_admin: boolean;

  @OneToMany(() => Game, (game) => game.user, { cascade: true })
  games: Game[];
}
