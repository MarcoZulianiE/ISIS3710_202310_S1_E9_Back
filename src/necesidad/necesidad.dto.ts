import { IsString, IsNotEmpty } from "class-validator";

export class NecesidadDto {
 @IsString()
 @IsNotEmpty()
 readonly tipo: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
}
