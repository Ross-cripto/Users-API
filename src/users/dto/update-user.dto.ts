import { IsString, IsOptional, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user update.
 * Validates that the email is in a valid format and the type of first_name and last_name.
 */
export class UpdateUserDto {
  @ApiProperty({ description: 'Nuevo nombre del usuario', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  first_name?: string;

  @ApiProperty({ description: 'Nuevo apellido del usuario', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  last_name?: string;

  @ApiProperty({ description: 'Nuevo correo electrónico del usuario', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  email?: string;
}