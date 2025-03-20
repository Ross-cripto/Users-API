import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsStrongPassword,
  MaxLength 
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user login.
 * Validates that the email is in a valid format and both fields are not empty.
 */
export class RegisterDto {
  @ApiProperty({ description: 'Correo electrónico del nuevo usuario' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @ApiProperty({ description: 'Contraseña del nuevo usuario' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({ description: 'Nombre del nuevo usuario', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  first_name?: string;

  @ApiProperty({ description: 'Apellido del nuevo usuario', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  last_name?: string;
}