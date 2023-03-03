import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { HorarioEntity } from '../horario/horario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { OfertaHorarioService } from './oferta-horario.service';

import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

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
        horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
        horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
        oferta: null,
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

  it('addHorarioToOferta', async () => {
    const newHorario: HorarioEntity = await horarioRepository.save({
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z')
    });

    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["kangaroo", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31"),
      usuario: null,
      contrato:null,
    });

    const result: OfertaEntity = await service.addHorarioToOferta(newOferta.id, newHorario.id);

    expect(result.horarios.length).toBe(1);
    expect(result.horarios[0]).not.toBeNull();
    expect(result.horarios[0].dia).toBe(newHorario.dia);
    expect(result.horarios[0].horaInicio).toStrictEqual(newHorario.horaInicio);
    expect(result.horarios[0].horaFin).toStrictEqual(newHorario.horaFin);
  });

  it('addHorarioToOferta should throw an exception for an invalid horario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["kangaroo", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31"),
      usuario: null,
      contrato:null,
      horarios: [],
    });

    await expect(() => service.addHorarioToOferta(newOferta.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("horario"));

  });

  it('addHorarioToOferta should throw an exception for an invalid oferta', async () => {
    const newHorario: HorarioEntity = await horarioRepository.save({
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z')
    });

    await expect(() => service.addHorarioToOferta("0", newHorario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));

  });

  it('findHorarioByOfertaIdHorarioId should return horario of an oferta', async () => {
    const horario: HorarioEntity = horariosList[0];
    const storedHorario: HorarioEntity = await service.findHorarioByOfertaIdHorarioId(oferta.id, horario.id);

    expect(storedHorario).not.toBeNull();
    expect(storedHorario.dia).toBe(horario.dia);
    expect(storedHorario.horaInicio).toStrictEqual(horario.horaInicio);
    expect(storedHorario.horaFin).toStrictEqual(horario.horaFin);

  });

  it('findHorarioByOfertaIdHorarioId should throw an exception for an invalid horario', async () => {
    await expect(()=> service.findHorarioByOfertaIdHorarioId(oferta.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("horario")); 
  });

  it('findHorarioByOfertaIdHorarioId should throw an exception for an invalid oferta', async () => {
    const horario: HorarioEntity = horariosList[0];
    await expect(()=> service.findHorarioByOfertaIdHorarioId("0", horario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta")); 
  });

    it('findHorarioByOfertaIdHorarioId should throw an exception for an horario not associated to the oferta', async () => {
    const newHorario: HorarioEntity = await horarioRepository.save({
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z')
    });

    await expect(()=> service.findHorarioByOfertaIdHorarioId(oferta.id, newHorario.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("oferta", "horario"));; 
  });

  it('findHorariosByOfertaId should return horarios of an oferta', async ()=>{
    const horarios: HorarioEntity[] = await service.findHorariosByOfertaId(oferta.id);
    expect(horarios.length).toBe(5)
  });

  it('findHorariosByOfertaId should throw an exception for an invalid oferta', async () => {
    await expect(()=> service.findHorariosByOfertaId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta")); 
  });

  it('associateHorariosOferta should update horario list for a oferta', async () => {
    const newHorario: HorarioEntity = await horarioRepository.save({
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z')
    });

    const updatedOferta: OfertaEntity = await service.associateHorariosOferta(oferta.id, [newHorario]);

    expect(updatedOferta.horarios.length).toBe(1);
    expect(updatedOferta.horarios[0].dia).toBe(newHorario.dia);
    expect(updatedOferta.horarios[0].horaInicio).toStrictEqual(newHorario.horaInicio);
    expect(updatedOferta.horarios[0].horaFin).toStrictEqual(newHorario.horaFin);
  });

  it('associateHorariosOferta should throw an exception for an invalid museum', async () => {
    const newHorario: HorarioEntity = await horarioRepository.save({
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z')
    });

    await expect(()=> service.associateHorariosOferta("0", [newHorario])).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta")); 
  });


  it('associateHorariosOferta should throw an exception for an invalid horario', async () => {
    const newHorario: HorarioEntity = horariosList[0];
    newHorario.id = "0";

    await expect(()=> service.associateHorariosOferta(oferta.id, [newHorario])).rejects.toHaveProperty("message", NotFoundErrorMessage("horario")); 
  });

  it('deleteHorarioOferta should remove an horario from an oferta', async () => {
    const horario: HorarioEntity = horariosList[0];
    
    await service.deleteHorarioOferta(oferta.id, horario.id);

    const storedOferta: OfertaEntity = await ofertaRepository.findOne({where: {id: oferta.id}, relations: ["horarios"]});
    const deletedHorario: HorarioEntity = storedOferta.horarios.find(a => a.id === horario.id);

    expect(deletedHorario).toBeUndefined();

  });

  it('deleteHorarioOferta should thrown an exception for an invalid horario', async () => {
    await expect(()=> service.deleteHorarioOferta(oferta.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("horario")); 
  });

  it('deleteHorarioOferta should thrown an exception for an invalid oferta', async () => {
    const horario: HorarioEntity = horariosList[0];
    await expect(()=> service.deleteHorarioOferta("0", horario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta")); 
  });

    it('deleteHorarioOferta should thrown an exception for an non asocciated horario', async () => {
    const newHorario: HorarioEntity = await horarioRepository.save({
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z')
    });

    await expect(()=> service.deleteHorarioOferta(oferta.id, newHorario.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("oferta", "horario")); 
  }); 
  
});
