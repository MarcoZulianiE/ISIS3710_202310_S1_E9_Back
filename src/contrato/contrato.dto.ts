import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";
import { OfertaDto } from "../oferta/oferta.dto";
import { UsuarioDto } from "../usuario/usuario.dto";

export class ContratoDto {
    
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    readonly fecha: Date;

    @IsNotEmpty()
    readonly oferta: OfertaDto;   

    @IsNotEmpty()
    readonly usuario: UsuarioDto;
}
