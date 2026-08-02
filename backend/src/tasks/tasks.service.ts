import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(
    userId: string,
    filters?: { status?: TaskStatus; priority?: TaskPriority; search?: string },
  ): Promise<Task[]> {
    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }

    let tasks: Task[];

    if (filters?.search) {
      tasks = await this.taskRepository.find({
        where: {
          ...where,
          title: Like(`%${filters.search}%`),
        },
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    } else {
      tasks = await this.taskRepository.find({
        where,
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    }

    return tasks;
  }

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const maxOrder = await this.taskRepository
      .createQueryBuilder('task')
      .select('MAX(task.order)', 'max')
      .where('task.userId = :userId', { userId })
      .andWhere('task.status = :status', {
        status: createTaskDto.status || TaskStatus.TODO,
      })
      .getRawOne();

    const task = this.taskRepository.create({
      ...createTaskDto,
      userId,
      order: (maxOrder?.max ?? -1) + 1,
    });

    return this.taskRepository.save(task);
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    await this.taskRepository.remove(task);
  }

  async reorder(
    userId: string,
    data: { taskId: string; status: string; order: number },
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: data.taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${data.taskId} not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You can only reorder your own tasks');
    }

    task.status = data.status as TaskStatus;
    task.order = data.order;

    return this.taskRepository.save(task);
  }
}
