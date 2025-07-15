import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { AuthGuard } from "./auth.guard";

@Injectable()
export class AdminGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // D'abord vérifier l'authentification avec le guard parent
    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      return false;
    }

    // Récupérer les informations de l'utilisateur depuis la requête
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Vérifier si l'utilisateur est admin
    if (!user || !user.is_admin) {
      throw new ForbiddenException(
        "Accès refusé : privilèges administrateur requis",
      );
    }

    return true;
  }
}
