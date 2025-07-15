import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import {
  RegisterDto,
  LoginDto,
  ValidateDto,
  LoginResponseDto,
} from '../dto/auth.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { User } from '../entities/user.entity';
import { CreateAdminUserDto } from 'src/dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: "S'inscrire sur la plateforme" })
  @ApiResponse({
    status: 201,
    description: 'Inscription réussie',
  })
  @ApiResponse({
    status: 409,
    description: 'Un utilisateur avec cet email existe déjà',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se connecter à son compte' })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Email ou mot de passe incorrect',
  })
  @ApiResponse({
    status: 403,
    description: 'Compte non validé',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Valider son compte avec le code reçu par email' })
  @ApiResponse({
    status: 200,
    description: 'Compte validé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Code de validation incorrect ou expiré',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async validate(@Body() validateDto: ValidateDto) {
    return await this.authService.validate(validateDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer son profil utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Profil récupéré avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Token non valide ou manquant',
  })
  getProfile(@GetUser() user: User) {
    return {
      message: 'Profil récupéré avec succès',
      user,
    };
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accéder au panel administrateur' })
  @ApiResponse({
    status: 200,
    description: 'Accès au panel admin accordé',
  })
  @ApiResponse({
    status: 401,
    description: 'Token non valide ou manquant',
  })
  @ApiResponse({
    status: 403,
    description: 'Privilèges administrateur requis',
  })
  getAdminPanel(@GetUser() user: User) {
    return {
      message: 'Accès au panel admin accordé',
      user,
      admin_info: 'Vous avez accès aux fonctionnalités administrateur',
    };
  }

  @Get('users')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer la liste des utilisateurs (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs récupérée',
  })
  @ApiResponse({
    status: 401,
    description: 'Token non valide ou manquant',
  })
  @ApiResponse({
    status: 403,
    description: 'Privilèges administrateur requis',
  })
  getAllUsers(@GetUser() user: User) {
    return {
      message: 'Liste des utilisateurs (admin uniquement)',
      requesting_user: user,
      note: 'Cette route nécessite des privilèges administrateur',
    };
  }

  @Post('admin/add')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un nouvel utilisateur administrateur' })
  @ApiResponse({
    status: 201,
    description: 'Nouvel utilisateur administrateur créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: "Données invalides pour la création de l'utilisateur",
  })
  @ApiResponse({
    status: 409,
    description: 'Un utilisateur avec cet email existe déjà',
  })
  async addNewAdminUser(@Body() createAdminUserDto: CreateAdminUserDto) {
    return this.authService.addNewAdminUser(createAdminUserDto);
  }
}
