import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { GameService } from '../services/game.service';
import { CreateGameDto, UpdateGameDto, GameResponseDto } from '../dto/game.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un avis sur un jeu' })
  @ApiResponse({
    status: 201,
    description: 'Avis créé avec succès',
    type: GameResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Vous avez déjà noté ce jeu',
  })
  async createGame(
    @Body() createGameDto: CreateGameDto,
    @GetUser() user: User,
  ): Promise<GameResponseDto> {
    return this.gameService.createGame(createGameDto, user);
  }

  @Get('my-games')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer tous mes avis sur les jeux' })
  @ApiResponse({
    status: 200,
    description: 'Liste de vos avis',
    type: [GameResponseDto],
  })
  async getMyGames(@GetUser() user: User): Promise<GameResponseDto[]> {
    return this.gameService.getUserGames(user.id);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer tous les avis (admin uniquement)' })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les avis',
    type: [GameResponseDto],
  })
  async getAllGames(): Promise<GameResponseDto[]> {
    return this.gameService.getAllGames();
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Récupérer tous les avis pour un jeu spécifique' })
  @ApiParam({
    name: 'name',
    description: 'Nom du jeu',
    example: 'The Legend of Zelda: Breath of the Wild',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des avis pour ce jeu',
    type: [GameResponseDto],
  })
  async getGamesByName(
    @Param('name') name: string,
  ): Promise<GameResponseDto[]> {
    return this.gameService.getGamesByName(name);
  }

  @Get('statistics/:name')
  @ApiOperation({ summary: "Récupérer les statistiques d'un jeu" })
  @ApiParam({
    name: 'name',
    description: 'Nom du jeu',
    example: 'The Legend of Zelda: Breath of the Wild',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques du jeu',
  })
  async getGameStatistics(@Param('name') name: string) {
    return this.gameService.getGameStatistics(name);
  }

  @Get(':name')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer mon avis sur un jeu spécifique' })
  @ApiParam({
    name: 'name',
    description: 'Nom du jeu',
    example: 'The Legend of Zelda: Breath of the Wild',
  })
  @ApiResponse({
    status: 200,
    description: 'Votre avis sur ce jeu',
    type: GameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun avis trouvé pour ce jeu',
  })
  async getMyGameByName(
    @Param('name') name: string,
    @GetUser() user: User,
  ): Promise<GameResponseDto> {
    return this.gameService.getGameByUserAndName(user, name);
  }

  @Put(':name')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier mon avis sur un jeu' })
  @ApiParam({
    name: 'name',
    description: 'Nom du jeu',
    example: 'The Legend of Zelda: Breath of the Wild',
  })
  @ApiResponse({
    status: 200,
    description: 'Avis modifié avec succès',
    type: GameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun avis trouvé pour ce jeu',
  })
  async updateGame(
    @Param('name') name: string,
    @Body() updateGameDto: UpdateGameDto,
    @GetUser() user: User,
  ): Promise<GameResponseDto> {
    return this.gameService.updateGame(name, updateGameDto, user);
  }

  @Delete(':name')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer mon avis sur un jeu' })
  @ApiParam({
    name: 'name',
    description: 'Nom du jeu',
    example: 'The Legend of Zelda: Breath of the Wild',
  })
  @ApiResponse({
    status: 200,
    description: 'Avis supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun avis trouvé pour ce jeu',
  })
  async deleteGame(
    @Param('name') name: string,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.gameService.deleteGame(name, user);
  }
}
