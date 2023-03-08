import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";
import { OfertaDto } from "src/oferta/oferta.dto";

export class ContratoDto {
    
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    readonly fecha: Date;

    @IsNotEmpty()
    readonly oferta: OfertaDto;   
}
