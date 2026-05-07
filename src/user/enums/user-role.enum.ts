import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  USER = 'USER',
  DEALER = 'DEALER',
  ADMIN = 'ADMIN',
}
registerEnumType(UserRole, { name: 'UserRole' });

export enum DealerStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}
registerEnumType(DealerStatus, { name: 'DealerStatus' });
