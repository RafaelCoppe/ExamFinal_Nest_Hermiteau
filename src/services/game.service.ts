import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { GameRepository } from "../repository/game.repository";
import { CreateGameDto, UpdateGameDto, GameResponseDto } from "../dto/game.dto";
import { User } from "../entities/user.entity";
import { Game } from "../entities/game.entity";

@Injectable()
export class GameService {
  constructor(private gameRepository: GameRepository) {}

  async createGame(
    createGameDto: CreateGameDto,
    user: User,
  ): Promise<GameResponseDto> {
    const { name, rating, opinion } = createGameDto;

    // Vérifier si l'utilisateur a déjà noté ce jeu
    const existingGame = await this.gameRepository.findGameByUserAndName(
      user,
      name,
    );

    if (existingGame) {
      throw new ConflictException(
        `Vous avez déjà noté le jeu "${name}". Utilisez la fonction de modification pour mettre à jour votre avis.`,
      );
    }

    const gameData: Partial<Game> = {
      name,
      rating,
      opinion,
      userId: user.id,
      user,
      rated_at: new Date(),
    };

    const game = await this.gameRepository.createGame(gameData);
    return this.formatGameResponse(game);
  }

  async getUserGames(userId: string): Promise<GameResponseDto[]> {
    const games = await this.gameRepository.findGamesByUser(userId);
    return games.map((game) => this.formatGameResponse(game));
  }

  async getAllGames(): Promise<GameResponseDto[]> {
    const games = await this.gameRepository.findAllGames();
    return games.map((game) => this.formatGameResponse(game));
  }

  async getGameByUserAndName(
    user: User,
    name: string,
  ): Promise<GameResponseDto> {
    const game = await this.gameRepository.findGameByUserAndName(user, name);

    if (!game) {
      throw new NotFoundException(
        `Aucun avis trouvé pour le jeu "${name}" de votre part.`,
      );
    }

    return this.formatGameResponse(game);
  }

  async updateGame(
    name: string,
    updateGameDto: UpdateGameDto,
    user: User,
  ): Promise<GameResponseDto> {
    const existingGame = await this.gameRepository.findGameByUserAndName(
      user,
      name,
    );

    if (!existingGame) {
      throw new NotFoundException(
        `Aucun avis trouvé pour le jeu "${name}". Créez d'abord un avis.`,
      );
    }

    const updateData: Partial<Game> = {};

    if (updateGameDto.rating !== undefined) {
      updateData.rating = updateGameDto.rating;
    }

    if (updateGameDto.opinion !== undefined) {
      updateData.opinion = updateGameDto.opinion;
    }

    updateData.rated_at = new Date(); // Mettre à jour la date de modification

    const updatedGame = await this.gameRepository.updateGame(
      user,
      name,
      updateData,
    );

    if (!updatedGame) {
      throw new NotFoundException(
        `Erreur lors de la mise à jour de l'avis pour "${name}".`,
      );
    }

    return this.formatGameResponse(updatedGame);
  }

  async deleteGame(name: string, user: User): Promise<{ message: string }> {
    const existingGame = await this.gameRepository.findGameByUserAndName(
      user,
      name,
    );

    if (!existingGame) {
      throw new NotFoundException(`Aucun avis trouvé pour le jeu "${name}".`);
    }

    await this.gameRepository.deleteGame(user, name);

    return {
      message: `Votre avis sur "${name}" a été supprimé avec succès.`,
    };
  }

  async getGamesByName(name: string): Promise<GameResponseDto[]> {
    const games = await this.gameRepository.findGamesByName(name);
    return games.map((game) => this.formatGameResponse(game));
  }

  async getGameStatistics(name: string): Promise<{
    gameName: string;
    totalReviews: number;
    averageRating: number;
    reviews: GameResponseDto[];
  }> {
    const games = await this.gameRepository.findGamesByName(name);
    const averageRating =
      await this.gameRepository.getAverageRatingByGame(name);

    return {
      gameName: name,
      totalReviews: games.length,
      averageRating: Math.round(averageRating * 100) / 100, // Arrondir à 2 décimales
      reviews: games.map((game) => this.formatGameResponse(game)),
    };
  }

  private formatGameResponse(game: Game): GameResponseDto {
    return {
      name: game.name,
      rating: game.rating,
      opinion: game.opinion,
      rated_at: game.rated_at,
      user: {
        id: game.user.id,
        email: game.user.email,
        first_name: game.user.first_name,
        last_name: game.user.last_name,
      },
    };
  }
}
