import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class HorarioDto {
    
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    readonly horaInicio: Date;
    
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    readonly horaFin: Date;
    
    @IsString()
    @IsNotEmpty()
    readonly dia: string;
}
