import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus, TaskPriority } from '../entities/task.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getRawOne: jest.fn(),
};

const mockTaskRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTaskRepository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', userId: 'user-1', status: TaskStatus.TODO },
        { id: '2', title: 'Task 2', userId: 'user-1', status: TaskStatus.DOING },
      ];
      mockTaskRepository.find.mockResolvedValue(mockTasks);

      const result = await service.findAll('user-1');

      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        order: { order: 'ASC', createdAt: 'DESC' },
      });
      expect(result).toEqual(mockTasks);
    });

    it('should filter tasks by status', async () => {
      mockTaskRepository.find.mockResolvedValue([]);

      await service.findAll('user-1', { status: TaskStatus.TODO });

      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: TaskStatus.TODO },
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    });

    it('should filter tasks by search term', async () => {
      mockTaskRepository.find.mockResolvedValue([]);

      await service.findAll('user-1', { search: 'test' });

      expect(mockTaskRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-1' }),
        }),
      );
    });
  });

  describe('create', () => {
    it('should create a task with auto-incremented order', async () => {
      const dto = { title: 'New Task', status: TaskStatus.TODO };
      const mockTask = { ...dto, id: 'task-1', userId: 'user-1', order: 0 };

      mockQueryBuilder.getRawOne.mockResolvedValue({ max: -1 });
      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.create('user-1', dto);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          userId: 'user-1',
          order: 0,
        }),
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task owned by the user', async () => {
      const existingTask = {
        id: 'task-1',
        title: 'Old Title',
        userId: 'user-1',
        status: TaskStatus.TODO,
      };

      mockTaskRepository.findOne.mockResolvedValue({ ...existingTask });
      mockTaskRepository.save.mockResolvedValue({
        ...existingTask,
        title: 'New Title',
      });

      const result = await service.update('task-1', 'user-1', {
        title: 'New Title',
      });

      expect(result.title).toBe('New Title');
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', 'user-1', { title: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user does not own the task', async () => {
      mockTaskRepository.findOne.mockResolvedValue({
        id: 'task-1',
        userId: 'other-user',
      });

      await expect(
        service.update('task-1', 'user-1', { title: 'Test' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a task owned by the user', async () => {
      const task = { id: 'task-1', userId: 'user-1' };
      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.remove.mockResolvedValue(task);

      await service.remove('task-1', 'user-1');

      expect(mockTaskRepository.remove).toHaveBeenCalledWith(task);
    });

    it('should throw NotFoundException for non-existent task', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user does not own the task', async () => {
      mockTaskRepository.findOne.mockResolvedValue({
        id: 'task-1',
        userId: 'other-user',
      });

      await expect(service.remove('task-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('reorder', () => {
    it('should update task status and order', async () => {
      const task = {
        id: 'task-1',
        userId: 'user-1',
        status: TaskStatus.TODO,
        order: 0,
      };
      mockTaskRepository.findOne.mockResolvedValue({ ...task });
      mockTaskRepository.save.mockResolvedValue({
        ...task,
        status: TaskStatus.DOING,
        order: 2,
      });

      const result = await service.reorder('user-1', {
        taskId: 'task-1',
        status: 'DOING',
        order: 2,
      });

      expect(result.status).toBe(TaskStatus.DOING);
      expect(result.order).toBe(2);
    });
  });
});
