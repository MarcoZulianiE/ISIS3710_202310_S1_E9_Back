import { Exclude, Expose } from 'class-transformer';
import { AntecedenteEntity } from '../antecedente/antecedente.entity';
import { ContratoEntity } from '../contrato/contrato.entity';
import { EspecialidadEntity } from '../especialidad/especialidad.entity';
import { NecesidadEntity } from '../necesidad/necesidad.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { ReseniaEntity } from '../resenia/resenia.entity';

export class UsuarioSeguroDto {
  @Expose()
  cedula: string;

  @Expose()
  nombre: string;

  @Expose()
  foto: string;

  @Expose()
  correoElectronico: string;

  @Expose()
  direccion: string;

  @Expose()
  celular: string;

  @Expose()
  tipoUsuario: string;

  @Expose()
  aniosExperiencia: number;

  @Expose()
  necesidades: NecesidadEntity[];

  @Expose()
  especialidades: EspecialidadEntity[];

  @Expose()
  reseniasRecibidas: ReseniaEntity[];

  @Expose()
  reseniasEscritas: ReseniaEntity[];

  @Expose()
  antecedentes: AntecedenteEntity[];

  @Expose()
  contratos: ContratoEntity[];

  @Expose()
  ofertas: OfertaEntity[];
}
