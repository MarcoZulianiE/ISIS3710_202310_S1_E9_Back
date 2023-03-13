import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class EspecialidadDto {
 @IsString()
 @IsNotEmpty()
 readonly tipo: string;
 
 @IsNumber()
 @IsNotEmpty()
 readonly aniosExperiencia: number;
}
