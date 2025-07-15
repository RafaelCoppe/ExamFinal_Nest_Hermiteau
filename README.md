# NestJS TypeORM Project

Ce projet utilise NestJS avec TypeORM pour la gestion de base de données.

## Configuration

1. Copiez le fichier `.env.example` vers `.env` et configurez vos variables d'environnement :
```bash
cp .env.example .env
```

2. Installez les dépendances :
```bash
npm install
```

3. Démarrez la base de données PostgreSQL avec Docker Compose :
```bash
docker-compose up -d db
```

## Base de données

Ce projet utilise TypeORM avec PostgreSQL. La configuration de la base de données se trouve dans `src/config/database.config.ts`.

### Entités

- **User** : Entité utilisateur avec id, email et password

### Services

- **UserService** : Service pour gérer les opérations CRUD des utilisateurs

### Contrôleurs

- **UserController** : API REST pour les utilisateurs
  - `GET /users` - Récupérer tous les utilisateurs
  - `GET /users/:id` - Récupérer un utilisateur par ID
  - `POST /users` - Créer un nouvel utilisateur
  - `PUT /users/:id` - Mettre à jour un utilisateur
  - `DELETE /users/:id` - Supprimer un utilisateur

## Développement

```bash
# Mode développement
npm run start:dev

# Build du projet
npm run build

# Production
npm run start:prod
```

## Migration depuis Prisma

Ce projet a été migré de Prisma vers TypeORM. Les principales modifications :

1. Remplacement de `@prisma/client` et `prisma` par `@nestjs/typeorm`, `typeorm` et `pg`
2. Création de l'entité `User` avec les décorateurs TypeORM
3. Configuration de TypeORM dans le module principal
4. Remplacement du `PrismaService` par `UserService` utilisant TypeORM Repository
5. Suppression du dossier `prisma/` et du fichier `schema.prisma`
