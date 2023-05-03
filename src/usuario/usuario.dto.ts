import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class UsuarioDto {

    @IsString()
    @IsNotEmpty()
    readonly cedula: string;

    @IsString()
    @IsNotEmpty()
    readonly contrasenia: string;

    @IsUrl()
    readonly foto: string;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsEmail()
    readonly correoElectronico: string;

    @IsString()
    @IsNotEmpty()
    readonly direccion: string;

    @IsString()
    @IsNotEmpty()
    readonly celular: string;

    @IsString()
    @IsNotEmpty()
    readonly tipoUsuario: string;

    @IsNumber()
    readonly aniosExperiencia: number;

    @IsArray()
    @IsOptional()
    readonly roles: string[];

}
