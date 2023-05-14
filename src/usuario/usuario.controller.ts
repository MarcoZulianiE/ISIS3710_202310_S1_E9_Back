import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Role } from '../shared/security/roles';
import { HasRoles } from '../shared/security/roles.decorator';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioSeguroDto } from './usuarioSeguro.dto';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ADMIN, Role.USER)
  @Get()
  async findAll() {
    const usuarios = await this.usuarioService.findAll();
    return plainToInstance(UsuarioSeguroDto, usuarios, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ADMIN, Role.USER)
  @Get(':usuarioId')
  async findOne(@Param('usuarioId') usuarioId: string) {
    const usuario = await this.usuarioService.findOne(usuarioId);
    return plainToInstance(UsuarioSeguroDto, usuario, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/email/:email')
  async findOneEmail(@Param('email') email: string) {
    const user = await this.usuarioService.findByEmail(email);
    return user;
  }

  @Post()
  async create(@Body() usuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
    return await this.usuarioService.create(usuario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ADMIN, Role.USER) // TODO: Solo los asociados
  @Put(':usuarioId')
  async update(
    @Param('usuarioId') usuarioId: string,
    @Body() usuarioDto: UsuarioDto,
  ) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
    const u = await this.usuarioService.update(usuarioId, usuario);
    return plainToInstance(UsuarioSeguroDto, u, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.ADMIN)
  @Delete(':usuarioId')
  @HttpCode(204)
  async delete(@Req() req: Request, @Param('usuarioId') usuarioId: string) {
    return await this.usuarioService.delete(usuarioId);
  }

  // ==================== AUTHENTICATION RELATED METHODS ====================

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(JSON.stringify(req.body));
  }
}
