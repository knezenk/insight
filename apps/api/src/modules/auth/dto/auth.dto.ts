import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'rafael@target360.com.br' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '360rafa', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token JWT emitido em /auth/login' })
  @IsString()
  refreshToken!: string;
}
