import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JWT Auth Guard según arquitectura
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
