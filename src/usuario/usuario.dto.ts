import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
import { IsNumber } from 'class-validator/types/decorator/decorators';

export class UsuarioDto {

    @IsNumber()
    @IsNotEmpty()
    readonly cedula: number;

    @IsString()
    @IsNotEmpty()
    readonly contrasenia: string;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly correoElectronico: string;

    @IsString()
    @IsNotEmpty()
    readonly direccion: string;

    @IsNumber()
    @IsNotEmpty()
    readonly celular: number;

    @IsString()
    @IsNotEmpty()
    readonly tipoUsuario: string;

}
