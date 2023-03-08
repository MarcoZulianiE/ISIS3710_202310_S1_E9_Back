import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

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

    @IsDate()
    @IsNotEmpty()
    readonly fechaInicio: Date;

    @IsDate()
    @IsNotEmpty()
    readonly fechaFin: Date; 

}
