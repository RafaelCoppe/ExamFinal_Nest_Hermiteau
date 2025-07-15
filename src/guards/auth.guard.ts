import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Token d'authentification manquant");
    }

    try {
      // Utiliser le JwtService avec sa configuration par défaut du module
      const payload = await this.jwtService.verifyAsync(token);

      // Attacher les informations de l'utilisateur à la requête
      (request as any).user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException("Token d'authentification invalide");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Vérifier l'en-tête Authorization standard (format: "Bearer <token>")
    const authHeader = request.headers.authorization;

    if (authHeader) {
      const [type, token] = authHeader.split(" ") ?? [];
      if (type === "Bearer" && token) {
        return token;
      }
    }

    // Vérifier si le token est envoyé directement dans l'en-tête Authorization (sans "Bearer")
    if (authHeader && !authHeader.includes(" ")) {
      return authHeader;
    }

    // Vérifier d'autres en-têtes possibles utilisés par Swagger UI
    const swaggerToken = request.headers["x-access-token"] as string;
    if (swaggerToken) {
      return swaggerToken;
    }

    return undefined;
  }
}
