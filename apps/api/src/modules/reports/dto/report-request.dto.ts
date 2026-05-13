import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsISO8601, IsOptional, IsString } from 'class-validator';
import type { ReportType } from '@insight/shared';

const TYPES: ReportType[] = [
  'audit_full',
  'daily_brief',
  'crisis',
  'competitive',
  'influencers_map',
  'narratives_map',
  'sector_intelligence',
  'social',
  'release',
  'custom',
];

export class ReportRequestBodyDto {
  @ApiProperty({ enum: TYPES })
  @IsIn(TYPES)
  type!: ReportType;

  @ApiProperty()
  @IsString()
  workspace!: string;

  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  from!: string;

  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  to!: string;

  @ApiProperty({ isArray: true, required: false })
  @IsOptional()
  @IsArray()
  recipients?: string[];
}
