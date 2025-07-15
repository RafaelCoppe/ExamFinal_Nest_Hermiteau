import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userData: Partial<User>): Promise<User> {
    return await this.userRepository.createUser(userData);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneByEmail(email);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    await this.userRepository.updateUser(id, userData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    return await this.userRepository.deleteUser(id);
  }
}
