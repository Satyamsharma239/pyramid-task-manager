import { AuthResponse, Task } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Auth
  async guestLogin(): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/guest', {
      method: 'POST',
    });
    this.setToken(data.access_token);
    return data;
  }

  async getMe() {
    return this.request<AuthResponse['user']>('/auth/me');
  }

  // Tasks
  async getTasks(params?: { status?: string; priority?: string; search?: string }): Promise<Task[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.priority) searchParams.set('priority', params.priority);
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return this.request<Task[]>(`/tasks${query ? `?${query}` : ''}`);
  }

  async createTask(data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    assignee?: string;
    labels?: string[];
  }): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderTask(data: { taskId: string; status: string; order: number }): Promise<Task> {
    return this.request<Task>('/tasks/reorder', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
