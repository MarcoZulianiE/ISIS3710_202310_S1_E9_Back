import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UsuarioDto } from "../usuario/usuario.dto";

export class OfertaDto {

    @IsNumber()
    @IsNotEmpty()
    readonly precio: number;

    @IsBoolean()
    @IsNotEmpty()
    readonly disponible: boolean;

    @IsString()
    @IsNotEmpty()
    readonly tipoOferta: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    readonly fechaInicio: Date;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    readonly fechaFin: Date; 

    @IsNotEmpty()
    readonly usuario: UsuarioDto

}
