import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString } from 'class-validator';

export class ScoresQueryDto {
  @ApiProperty({ example: 'mjsp' })
  @IsString()
  workspace!: string;

  @ApiProperty({ format: 'date-time', example: '2026-04-01T00:00:00Z' })
  @IsISO8601()
  from!: string;

  @ApiProperty({ format: 'date-time', example: '2026-04-30T23:59:59Z' })
  @IsISO8601()
  to!: string;
}
