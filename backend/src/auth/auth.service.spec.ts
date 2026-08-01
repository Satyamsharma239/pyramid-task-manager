import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('guestLogin', () => {
    it('should create a guest user and return an access token', async () => {
      const mockUser = {
        id: 'test-uuid',
        displayName: 'Guest_ABCD',
        authType: 'guest',
        createdAt: new Date(),
      };

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.guestLogin();

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          displayName: expect.stringContaining('Guest_'),
          authType: 'guest',
        }),
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 'test-uuid' });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: mockUser,
      });
    });
  });

  describe('findUserById', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: 'test-uuid', displayName: 'Guest_1234' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserById('test-uuid');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-uuid' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findUserById('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
