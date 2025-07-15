import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'utilisateur@exemple.com',
  })
  @IsEmail({}, { message: "L'email doit être valide" })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({
    description:
      'Mot de passe pour le compte utilisateur (minimum 6 caractères)',
    example: 'monMotDePasseSecurise123',
    minLength: 6,
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @ApiProperty({
    description: "Nom de famille de l'utilisateur",
    example: 'Dupont',
  })
  @IsString({ message: 'Le nom de famille doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom de famille est requis' })
  last_name: string;

  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: 'Jean',
  })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  first_name: string;
}

export class CreateAdminUserDto {
  @ApiProperty({
    description: "Adresse email de l'administrateur",
    example: 'admin@exemple.com',
  })
  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @ApiProperty({
    description:
      'Mot de passe pour le compte administrateur (minimum 6 caractères)',
    example: 'motDePasseAdminSecurise123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @ApiProperty({
    description: "Prénom de l'administrateur",
    example: 'Jean',
  })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  first_name: string;

  @ApiProperty({
    description: "Nom de famille de l'administrateur",
    example: 'Dupont',
  })
  @IsNotEmpty({ message: 'Le nom de famille est requis' })
  @IsString({ message: 'Le nom de famille doit être une chaîne de caractères' })
  last_name: string;
}
