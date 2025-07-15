import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    await this.repository.update(id, user);
    return this.findById(id);
  }

  async activateUser(email: string): Promise<void> {
    await this.repository.update({ email }, { is_active: true });
  }

  async deleteUser(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
