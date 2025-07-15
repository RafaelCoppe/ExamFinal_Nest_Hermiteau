import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameController } from "../controllers/game.controller";
import { GameService } from "../services/game.service";
import { GameRepository } from "../repository/game.repository";
import { Game } from "../entities/game.entity";
import { AuthModule } from "./auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Game]), AuthModule],
  controllers: [GameController],
  providers: [GameService, GameRepository],
  exports: [GameService, GameRepository],
})
export class GameModule {}
