import {
  IsString,
  IsInt,
  IsOptional,
  Min,
  Max,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateGameDto {
  @ApiProperty({
    description: "Nom du jeu",
    example: "The Legend of Zelda: Breath of the Wild",
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: "Note du jeu (entre 0 et 10)",
    example: 9,
    minimum: 0,
    maximum: 10,
  })
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({
    description: "Avis sur le jeu",
    example: "Un excellent jeu avec une liberté de gameplay incroyable.",
  })
  @IsString()
  @MinLength(1)
  opinion: string;
}

export class UpdateGameDto {
  @ApiPropertyOptional({
    description: "Note du jeu (entre 0 et 10)",
    example: 8,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({
    description: "Avis sur le jeu",
    example: "Après avoir rejoué, je trouve que le jeu a quelques défauts.",
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  opinion?: string;
}

export class GameResponseDto {
  @ApiProperty({ description: "Nom du jeu" })
  name: string;

  @ApiProperty({ description: "Note du jeu" })
  rating: number;

  @ApiProperty({ description: "Avis sur le jeu" })
  opinion: string;

  @ApiProperty({ description: "Date de notation" })
  rated_at: Date;

  @ApiProperty({ description: "Informations de l'utilisateur" })
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}
