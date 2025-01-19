import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsNumber,
  IsDate,
} from 'class-validator';

export class Social {
  facebook: {
    likes: number;
    comments: number;
    shares: number;
  };
  vk: {
    shares: number;
  };
}

export class Thread {
  uuid: string;
  url: string;
  site_full: string;
  site: string;
  site_section?: string;
  site_categories?: string[];
  section_title?: string;
  title: string;
  title_full?: string;
  published: Date;
  replies_count: number;
  participants_count: number;
  site_type: 'news' | 'blogs' | 'discussions';
  country?: string;
  main_image?: string;
  performance_score: number;
  domain_rank?: number | null;
  domain_rank_updated?: Date | null;
  social: Social;
}

export class CreatePostDto {
  @IsOptional()
  @IsObject()
  thread: Thread;

  @IsString()
  @IsNotEmpty()
  uuid: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  ord_in_thread: number;

  @IsOptional()
  @IsString()
  parent_url?: string | null;

  @IsOptional()
  @IsString()
  author?: string | null;

  @IsString()
  @IsNotEmpty()
  published: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsOptional()
  sentiment: string | null;

  @IsArray()
  @IsOptional()
  categories: string[] | null;

  @IsArray()
  @IsOptional()
  topics: string[] | null;

  @IsBoolean()
  ai_allow: boolean;

  @IsBoolean()
  has_canonical: boolean;

  @IsBoolean()
  webz_reporter: boolean;

  @IsArray()
  external_links: string[];

  @IsArray()
  external_images: Array<{
    url: string;
    meta_info: string;
    uuid: string;
    label: string[];
  }>;

  @IsObject()
  entities: {
    persons?: Array<{ name: string; sentiment: string }>;
    organizations?: Array<{ name: string; sentiment: string }>;
    locations?: Array<{ name: string; sentiment: string }>;
  };

  @IsObject()
  syndication: {
    syndicated: boolean;
    syndicate_id?: string | null;
    first_syndicated: boolean;
  };

  @IsNumber()
  @IsOptional()
  rating: number | null;

  @IsString()
  @IsOptional()
  highlightText?: string;

  @IsString()
  @IsOptional()
  highlightTitle?: string;

  @IsString()
  @IsOptional()
  highlightThreadTitle?: string;

  @IsDate()
  crawled: Date;

  @IsDate()
  updated: Date;
}
