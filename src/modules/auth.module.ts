import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, AuthGuard, AdminGuard],
  exports: [AuthService, UserRepository, AuthGuard, AdminGuard],
})
export class AuthModule {}
