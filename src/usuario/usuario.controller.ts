import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {

  constructor(private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService) {}

  @Get()
  async findAll() {
    return await this.usuarioService.findAll();
  }

  @Get(':usuarioId')
  async findOne(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioService.findOne(usuarioId);
  }

  @Post()
  async create(@Body() usuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
    return await this.usuarioService.create(usuario);
  }

  @Put(':usuarioId')
  async update(@Param('usuarioId') usuarioId: string, @Body() usuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
    return await this.usuarioService.update(usuarioId, usuario);
  }

  @Delete(':usuarioId')
  @HttpCode(204)
  async delete(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioService.delete(usuarioId);
  }

  // ==================== AUTHENTICATION RELATED METHODS ====================
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req);
  }
}
