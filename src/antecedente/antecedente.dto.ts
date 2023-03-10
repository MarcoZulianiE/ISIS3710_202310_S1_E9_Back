/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';

export class AntecedenteDto {

    @IsString()
    @IsNotEmpty()
    readonly tipo: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
}
