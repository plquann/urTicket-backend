export const SWAGGER_API_ROOT = 'api/v1/docs';
export const SWAGGER_API_NAME = 'urTicket API';
export const SWAGGER_API_DESCRIPTION = 'Movie Platform for movie information, booking ticket. Building with Nodejs Nestjs PostgreSQL.';
export const SWAGGER_API_CURRENT_VERSION = '1.0';

export const SEQUELIZE = 'SEQUELIZE';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  ANOTHER = 'ANOTHER',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GHOST = 'GHOST',
}

export const ROLES_KEY = 'roles';

export enum MovieClassification {
  P = 'P',
  C13 = 'C13',
  C18 = 'C18',
}

export enum MovieStatus {
  PLAYING = 'PLAYING',
  UPCOMING = 'UPCOMING',
  OVER = 'OVER',
};

export const paginationDefault = {
  page: 1,
  limit: 12,
}

