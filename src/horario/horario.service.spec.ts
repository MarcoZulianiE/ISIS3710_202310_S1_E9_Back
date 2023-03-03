import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { HorarioEntity } from './horario.entity';
import { HorarioService } from './horario.service';

import { faker } from '@faker-js/faker';
import { NotFoundErrorMessage } from '../shared/errors/business-errors';

describe('HorarioService', () => {
  let service: HorarioService;
  let repository: Repository<HorarioEntity>;
  let horarioList: HorarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [HorarioService],
    }).compile();

    service = module.get<HorarioService>(HorarioService);
    repository = module.get<Repository<HorarioEntity>>(getRepositoryToken(HorarioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear(); 
    horarioList = []; 

    for(let i = 0; i < 5; i++){
      const horario: HorarioEntity = await repository.save({
        dia: faker.date.weekday(),
        horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:10:00.000Z'),
        horaFin: faker.date.between('1800-01-01T00:11:00.000Z', '1800-01-02T00:14:00.000Z'),
        })
      horarioList.push(horario);
      }
    }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all horarios', async () => {
    const horarios: HorarioEntity[] = await service.findAll();
    expect(horarios).not.toBeNull();
    expect(horarios).toHaveLength(horarioList.length);
  });

  it('findOne should return an horario by id', async () => {
    const storedHorario: HorarioEntity = horarioList[0];
    const horario: HorarioEntity = await service.findOne(storedHorario.id);

    expect(horario).not.toBeNull();
    expect(horario.dia).toEqual(storedHorario.dia);
    expect(horario.horaInicio).toStrictEqual(storedHorario.horaInicio);
    expect(horario.horaFin).toStrictEqual(storedHorario.horaFin);
    
  });

  it('findOne should throw an exception for an invaild horario', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("horario"));
  });

  it('create should create a new horario', async () => {
    const horario: HorarioEntity = {
      id: "", 
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:10:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:11:00.000Z', '1800-01-02T00:14:00.000Z'),
      oferta: null,

    }

    const newHorario: HorarioEntity = await service.create(horario);
    expect(newHorario).not.toBeNull();

    const storedHorario: HorarioEntity = await repository.findOne({where: {id: newHorario.id}});
    expect(storedHorario).not.toBeNull();
    expect(storedHorario.dia).toEqual(horario.dia);
    expect(storedHorario.horaInicio).toStrictEqual(horario.horaInicio);
    expect(storedHorario.horaFin).toStrictEqual(horario.horaFin);
    
  
  });

  it('create should throw an exception for an invalid horaInicio and horaFin', async () => {
    const horario: HorarioEntity = {
      id: "", 
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:11:00.000Z', '1800-01-02T00:12:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-01T00:01:00.000Z'),
      oferta: null,
    }

    await expect(() => service.create(horario)).rejects.toHaveProperty("message", "La hora de inicio debe ser menor que la hora de fin");
  });

  it('update should modify an horario',async () => {
    const horario: HorarioEntity = horarioList[0]; 
    horario.dia = faker.date.weekday(); 


    const updatedHorario: HorarioEntity = await service.update(horario.id, horario);
    expect(updatedHorario).not.toBeNull();

    const storedHorario: HorarioEntity = await repository.findOne({where: {id: horario.id}});
    expect(storedHorario).not.toBeNull();
    expect(storedHorario.dia).toEqual(horario.dia);
    expect(storedHorario.horaInicio).toStrictEqual(horario.horaInicio);
    expect(storedHorario.horaFin).toStrictEqual(horario.horaFin);
  });

  it('update should throw an exception for an invalid horario', async () => {
    let horario: HorarioEntity = horarioList[0];
    horario = {
      ...horario, dia: faker.date.weekday()
    }
    await expect(() => service.update("0", horario)).rejects.toHaveProperty("message", NotFoundErrorMessage("horario"));
  });

  it('delete should remove an horario', async () => {
    const horario: HorarioEntity = horarioList[0];
    await service.delete(horario.id);
  
    const deletedHorario: HorarioEntity = await repository.findOne({ where: { id: horario.id } })
    expect(deletedHorario).toBeNull();
  });

  it('delete should throw an exception for an invalid horario', async () => {
    const horario: HorarioEntity = horarioList[0];
    await service.delete(horario.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("horario"));
  });


});
