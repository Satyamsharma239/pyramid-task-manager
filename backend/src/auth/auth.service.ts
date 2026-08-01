import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async guestLogin() {
    const randomSuffix = uuidv4().substring(0, 4).toUpperCase();
    const user = this.userRepository.create({
      displayName: `Guest_${randomSuffix}`,
      authType: 'guest',
    });
    const savedUser = await this.userRepository.save(user);
    const payload = { sub: savedUser.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: savedUser,
    };
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
