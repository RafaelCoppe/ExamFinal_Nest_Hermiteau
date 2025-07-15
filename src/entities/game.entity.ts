import { Entity, PrimaryColumn, JoinColumn } from "typeorm";
import { ManyToOne, Column } from "typeorm";
import { User } from "./user.entity";

@Entity("games")
export class Game {
  @PrimaryColumn({ type: "uuid" })
  userId: string;

  @PrimaryColumn()
  name: string;

  @ManyToOne(() => User, (user) => user.games, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "int", default: 0 })
  rating: number;

  @Column({ type: "text" })
  opinion: string;

  @Column({ type: "date", default: () => "CURRENT_TIMESTAMP" })
  rated_at: Date;
}
