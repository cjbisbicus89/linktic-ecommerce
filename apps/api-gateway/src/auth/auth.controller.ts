import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

// DTOs con decoradores de validación según prueba técnica
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

// Controller de autenticación según arquitectura
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    // Validación simple según prueba técnica
    if (loginDto.email === 'admin@linktic.com' && loginDto.password === 'admin123') {
      const payload = { 
        sub: 1, 
        email: loginDto.email,
        iat: Math.floor(Date.now() / 1000)
      };
      
      const token = this.jwtService.sign(payload);
      
      return {
        token,
        user: {
          id: 1,
          email: loginDto.email
        }
      };
    }
    
    throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    // Simulación de registro según prueba técnica
    const payload = { 
      sub: Date.now(), 
      email: registerDto.email,
      iat: Math.floor(Date.now() / 1000)
    };
    
    const token = this.jwtService.sign(payload);
    
    return {
      token,
      user: {
        id: Date.now(),
        email: registerDto.email
      }
    };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verificar token JWT' })
  @ApiResponse({ status: 200, description: 'Token válido' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async verify(@Body() body: { token: string }): Promise<{ valid: boolean }> {
    try {
      this.jwtService.verify(body.token);
      return { valid: true };
    } catch {
      return { valid: false };
    }
  }
}
