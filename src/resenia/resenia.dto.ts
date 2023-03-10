/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class ReseniaDto {
    
        @IsString()
        @IsNotEmpty()
        readonly titulo: string;
    
        @IsNumber()
        @IsNotEmpty()
        readonly calificacion: number;
    
        @IsString()
        @IsNotEmpty()
        readonly descripcion: string;
}
