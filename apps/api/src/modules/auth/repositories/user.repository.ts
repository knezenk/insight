import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';

import type { Role } from '@insight/shared';

interface InternalUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  workspaces: string[];
  passwordHash: string;
}

/**
 * Repositório de usuários · in-memory por enquanto.
 * Em produção: chamada a API externa (SSO/Okta/Auth0) seguindo o
 * mesmo padrão Mock vs Http dos demais providers.
 */
@Injectable()
export class UserRepository {
  private readonly users: InternalUser[] = [
    this.seed({
      id: 'rafael',
      email: 'rafael@target360.com.br',
      name: 'Rafael Barbosa',
      role: 'super_admin',
      workspaces: ['mjsp', 'btg', 'defesa', 'ebserh', 'tce-ce', 'petrobras', 'agu'],
      password: '360rafa',
    }),
    this.seed({
      id: 'juliana',
      email: 'juliana@target360.com.br',
      name: 'Juliana Pires',
      role: 'editor',
      workspaces: ['mjsp', 'btg'],
      password: 'editor360',
    }),
    this.seed({
      id: 'eduardo',
      email: 'eduardo@mjsp.gov.br',
      name: 'Eduardo Lima',
      role: 'cliente',
      workspaces: ['mjsp'],
      password: 'cliente360',
    }),
  ];

  private seed(input: { id: string; email: string; name: string; role: Role; workspaces: string[]; password: string }): InternalUser {
    return {
      id: input.id,
      email: input.email,
      name: input.name,
      role: input.role,
      workspaces: input.workspaces,
      passwordHash: this.hash(input.password),
    };
  }

  async findByEmail(email: string): Promise<InternalUser | undefined> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async findById(id: string): Promise<InternalUser | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) return false;
    return user.passwordHash === this.hash(password);
  }

  private hash(password: string): string {
    return crypto.createHash('sha256').update(`insight:${password}`).digest('hex');
  }
}
