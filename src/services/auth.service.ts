import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto-js";
import { User } from "../entities/user.entity";
import { RegisterDto, LoginDto, ValidateDto } from "../dto/auth.dto";
import { UserRepository } from "src/repository/user.repository";

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  makeJwt = (user: Partial<User>) => {
    const payload = {
      id: user.id,
      email: user.email,
      fullName: `${user.first_name} ${user.last_name}`,
      is_admin: user.is_admin,
    };
    const token = this.jwtService.sign(payload);
    return token;
  };

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    const { email, password, first_name, last_name } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException("Un utilisateur avec cet email existe déjà");
    }

    // Hasher le mot de passe avec MD5
    const hashedPassword = crypto.MD5(password).toString();

    // Créer le nouvel utilisateur
    const newUser = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      is_active: false,
      is_admin: false,
    });

    // Envoyer l'email de validation
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Validation de votre compte",
        template: "validation-email",
        context: {
          first_name,
          validation_code: newUser.validation_code,
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      // On continue même si l'email échoue
    }

    // Retourner les informations sans le mot de passe

    const {
      password: _,
      validation_code: __,
      ...userWithoutSensitiveData
    } = newUser;

    return {
      message:
        "Utilisateur créé avec succès. Un email de validation a été envoyé.",
      user: userWithoutSensitiveData,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ message: string; user: Partial<User>; access_token: string }> {
    const { email, password } = loginDto;

    // Trouver l'utilisateur par email
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Email ou mot de passe incorrect");
    }

    if (!user.is_active) {
      throw new UnauthorizedException("Compte non activé");
    }

    // Vérifier le mot de passe
    const hashedPassword = crypto.MD5(password).toString();
    if (user.password !== hashedPassword) {
      throw new UnauthorizedException("Email ou mot de passe incorrect");
    }

    // Créer le payload JWT
    const access_token = this.makeJwt(user);

    // Retourner les informations sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    return {
      message: "Connexion réussie",
      user: userWithoutPassword,
      access_token,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async activateUser(email: string): Promise<void> {
    await this.userRepository.activateUser(email);
  }

  async validate(
    validateDto: ValidateDto,
  ): Promise<{ message: string; user: Partial<User>; access_token: string }> {
    const { email, validation_code } = validateDto;

    // Trouver l'utilisateur par email
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    // Vérifier si l'utilisateur est déjà activé
    if (user.is_active) {
      throw new BadRequestException("Compte déjà activé");
    }

    // Vérifier le code de validation
    if (user.validation_code !== validation_code) {
      throw new BadRequestException("Code de validation incorrect");
    }

    // Activer l'utilisateur
    await this.userRepository.updateUser(
      user.id,
      { is_active: true, validation_code: null }, // Supprimer le code de validation après activation
    );

    // Récupérer l'utilisateur mis à jour
    const updatedUser = await this.userRepository.findOneByEmail(email);

    if (!updatedUser) {
      throw new BadRequestException("Erreur lors de la mise à jour");
    }

    // Créer le payload JWT
    const access_token = this.makeJwt(updatedUser);

    // Retourner les informations sans les données sensibles
    const {
      password: _,
      validation_code: __,
      ...userWithoutSensitiveData
    } = updatedUser;

    return {
      message: "Compte validé avec succès",
      user: userWithoutSensitiveData,
      access_token,
    };
  }
}
