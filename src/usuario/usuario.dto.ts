import {IsNotEmpty, IsString, IsNumber} from 'class-validator';

export class UsuarioDto {

    @IsString()
    @IsNotEmpty()
    readonly cedula: string;

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

    @IsString()
    @IsNotEmpty()
    readonly celular: string;

    @IsString()
    @IsNotEmpty()
    readonly tipoUsuario: string;

}
