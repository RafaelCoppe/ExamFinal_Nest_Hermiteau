import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async createGame(gameData: Partial<Game>): Promise<Game> {
    const game = this.gameRepository.create(gameData);
    return await this.gameRepository.save(game);
  }

  async findGameByUserAndName(user: User, name: string): Promise<Game | null> {
    return await this.gameRepository.findOne({
      where: { userId: user.id, name },
      relations: ['user'],
    });
  }

  async findGamesByUser(userId: string): Promise<Game[]> {
    return await this.gameRepository.find({
      where: { userId },
      relations: ['user'],
      order: { rated_at: 'DESC' },
    });
  }

  async findAllGames(): Promise<Game[]> {
    return await this.gameRepository.find({
      relations: ['user'],
      order: { rated_at: 'DESC' },
    });
  }

  async updateGame(
    user: User,
    name: string,
    updateData: Partial<Game>,
  ): Promise<Game | null> {
    await this.gameRepository.update(
      { userId: user.id, name },
      updateData,
    );
    return await this.findGameByUserAndName(user, name);
  }

  async deleteGame(user: User, name: string): Promise<void> {
    await this.gameRepository.delete({
      userId: user.id,
      name,
    });
  }

  async findGamesByName(name: string): Promise<Game[]> {
    return await this.gameRepository.find({
      where: { name },
      relations: ['user'],
      order: { rated_at: 'DESC' },
    });
  }
  async getAverageRatingByGame(name: string): Promise<number> {
    const result = await this.gameRepository
      .createQueryBuilder('game')
      .select('AVG(game.rating)', 'average')
      .where('game.name = :name', { name })
      .getRawOne();

    return result?.average ? parseFloat(result.average) : 0;
  }
}
