import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { RegisterDto, LoginDto, ValidateDto } from "../dto/auth.dto";
import { GetUser } from "../decorators/get-user.decorator";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("validate")
  @HttpCode(HttpStatus.OK)
  async validate(@Body() validateDto: ValidateDto) {
    return await this.authService.validate(validateDto);
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getProfile(@GetUser() user: any) {
    return {
      message: "Profil récupéré avec succès",
      user: user,
    };
  }

  @Get("admin")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  getAdminPanel(@GetUser() user: any) {
    return {
      message: "Accès au panel admin accordé",
      user: user,
      admin_info: "Vous avez accès aux fonctionnalités administrateur",
    };
  }

  @Get("users")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  getAllUsers(@GetUser() user: any) {
    return {
      message: "Liste des utilisateurs (admin uniquement)",
      requesting_user: user,
      note: "Cette route nécessite des privilèges administrateur",
    };
  }
}
