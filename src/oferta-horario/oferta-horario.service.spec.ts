import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { HorarioEntity } from '../horario/horario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { OfertaHorarioService } from './oferta-horario.service';

import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OfertaHorarioService', () => {
  let service: OfertaHorarioService;
  let ofertaRepository: Repository<OfertaEntity>;
  let horarioRepository: Repository<HorarioEntity>;
  let oferta: OfertaEntity;
  let horariosList: HorarioEntity[];
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [OfertaHorarioService],
    }).compile();

    service = module.get<OfertaHorarioService>(OfertaHorarioService);
    ofertaRepository = module.get<Repository<OfertaEntity>>(getRepositoryToken(OfertaEntity));
    horarioRepository = module.get<Repository<HorarioEntity>>(getRepositoryToken(HorarioEntity));

    await seedDatabase();

  });
  
  const seedDatabase = async () => {
    ofertaRepository.clear();
    horarioRepository.clear();

    horariosList = [];
    for(let i = 0; i < 5; i++){
      const horario: HorarioEntity = await horarioRepository.save({
        dia: faker.date.weekday(),
        horarioInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
        horarioFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z')
      });
      horariosList.push(horario);
    }
    
    oferta = await ofertaRepository.save({
      id: "", 
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["kangaroo", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31"), 
      horarios: horariosList,
      usuario: null,
      contrato:null,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
});
