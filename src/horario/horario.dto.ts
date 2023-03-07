import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class HorarioDto {
    
    @IsDate()
    @IsNotEmpty()
    readonly horaInicio: Date;
    
    @IsDate()
    @IsNotEmpty()
    readonly horaFin: Date;
    
    @IsString()
    @IsNotEmpty()
    readonly dia: string;
}
