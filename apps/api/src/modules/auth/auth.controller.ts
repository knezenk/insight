import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import type { AuthUserDto, LoginRequestDto, LoginResponseDto, RefreshTokenRequestDto } from '@insight/shared';

import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login com email e senha · retorna access + refresh tokens' })
  @ApiBody({ type: LoginDto })
  login(@Body() _body: LoginRequestDto, @CurrentUser() user: AuthUserDto): Promise<LoginResponseDto> {
    return this.auth.issueTokens(user);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Renova access token a partir de refresh token válido' })
  @ApiBody({ type: RefreshTokenDto })
  refresh(@Body() body: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    return this.auth.refresh(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout · invalida tokens client-side (versão stateless)' })
  async logout(): Promise<void> {
    return;
  }
}
