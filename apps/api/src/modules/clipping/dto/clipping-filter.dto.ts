import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  type ClippingFilterDto,
  MAX_PAGE_SIZE,
  type MediaSegment,
  type MediaType,
  type SentimentScoreValue,
} from '@insight/shared';

const SEGMENTS: MediaSegment[] = [
  'PREMIUM',
  'NACIONAL_TV',
  'NACIONAL_DIGITAL',
  'ESPECIALIZADO',
  'REGIONAL',
  'HOSTIL_ESTRUTURAL',
];
const MEDIA: MediaType[] = ['tv', 'radio', 'print', 'online', 'social'];
const SENTS: SentimentScoreValue[] = [3, 2, 1, -1, -2, -3];

export class ClippingFilterQueryDto implements ClippingFilterDto {
  @ApiPropertyOptional()
  @IsString()
  workspace!: string;

  @ApiPropertyOptional({ format: 'date-time' })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({ format: 'date-time' })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional({ isArray: true, enum: SEGMENTS })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsIn(SEGMENTS, { each: true })
  segments?: MediaSegment[];

  @ApiPropertyOptional({ isArray: true, enum: MEDIA })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsIn(MEDIA, { each: true })
  mediaTypes?: MediaType[];

  @ApiPropertyOptional({ isArray: true, enum: SENTS })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]))
  @IsArray()
  @IsIn(SENTS, { each: true })
  sentiments?: SentimentScoreValue[];

  @ApiPropertyOptional({ isArray: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  categories?: string[];

  @ApiPropertyOptional({ isArray: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  sources?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  pageSize?: number;
}
