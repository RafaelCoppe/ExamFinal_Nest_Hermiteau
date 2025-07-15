import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: "Adresse email pour l'inscription",
    example: 'utilisateur@exemple.com',
  })
  @IsEmail({}, { message: "L'email doit être valide" })
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
    description: "Prénom de l'utilisateur",
    example: 'Jean',
  })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  first_name: string;

  @ApiProperty({
    description: "Nom de famille de l'utilisateur",
    example: 'Dupont',
  })
  @IsString({ message: 'Le nom de famille doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom de famille est requis' })
  last_name: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Adresse email pour la connexion',
    example: 'utilisateur@exemple.com',
  })
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @ApiProperty({
    description: 'Mot de passe pour la connexion',
    example: 'monMotDePasseSecurise123',
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;
}

export class ValidateDto {
  @ApiProperty({
    description: 'Adresse email à valider',
    example: 'utilisateur@exemple.com',
  })
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @ApiProperty({
    description: 'Code de validation reçu par email',
    example: 'ABC123',
  })
  @IsString({
    message: 'Le code de validation doit être une chaîne de caractères',
  })
  @IsNotEmpty({ message: 'Le code de validation est requis' })
  validation_code: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Message de réponse',
    example: 'Connexion réussie',
  })
  message: string;

  @ApiProperty({
    description: "Informations de l'utilisateur",
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: "Identifiant unique de l'utilisateur",
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      email: {
        type: 'string',
        description: "Adresse email de l'utilisateur",
        example: 'utilisateur@exemple.com',
      },
      first_name: {
        type: 'string',
        description: "Prénom de l'utilisateur",
        example: 'Jean',
      },
      last_name: {
        type: 'string',
        description: "Nom de famille de l'utilisateur",
        example: 'Dupont',
      },
      is_active: {
        type: 'boolean',
        description: 'Indique si le compte utilisateur est actif',
        example: true,
      },
      is_admin: {
        type: 'boolean',
        description: "Indique si l'utilisateur a des privilèges administrateur",
        example: false,
      },
    },
  })
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_admin: boolean;
  };

  @ApiProperty({
    description: "Token d'accès JWT pour l'authentification",
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}
