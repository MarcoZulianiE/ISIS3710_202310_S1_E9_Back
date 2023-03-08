import { IsDate, IsNotEmpty } from "class-validator";
import { OfertaDto } from "src/oferta/oferta.dto";

export class ContratoDto {
    @IsDate()
    @IsNotEmpty()
    readonly fecha: Date;

    @IsNotEmpty()
    readonly oferta: OfertaDto;   
}
