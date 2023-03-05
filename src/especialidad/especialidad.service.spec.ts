import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EspecialidadEntity } from './especialidad.entity';
import { EspecialidadService } from './especialidad.service';


describe('EspecialidadService', () => {
  let service: EspecialidadService;
  let repository: Repository<EspecialidadEntity>;
  let especialidadesList: EspecialidadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports : [...TypeOrmTestingConfig()],
      providers: [EspecialidadService],
    }).compile();

    service = module.get<EspecialidadService>(EspecialidadService);
    repository = module.get<Repository<EspecialidadEntity>>(getRepositoryToken(EspecialidadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    especialidadesList = [];
    for(let i = 0; i < 5; i++){
        const especialidad: EspecialidadEntity = await repository.save({
        tipo: faker.helpers.arrayElement(["educativa", "salud","comportamental"]),
        aniosExperiencia: faker.datatype.number({min: 10000, max: 99999999999})})
        especialidadesList.push(especialidad);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all especialidades', async () => {
    const especialidad: EspecialidadEntity[] = await service.findAll();
    expect(especialidad).not.toBeNull();
    expect(especialidad).toHaveLength(especialidadesList.length);
  });

  it('findOne should return a especialidad by id', async () => {
    const storedEspecialidad: EspecialidadEntity = especialidadesList[0];
    const especialidad: EspecialidadEntity = await service.findOne(storedEspecialidad.id);
    expect(especialidad).not.toBeNull();
    expect(especialidad.tipo).toEqual(storedEspecialidad.tipo)
    expect(especialidad.aniosExperiencia).toEqual(storedEspecialidad.aniosExperiencia)
  });
  
  it('findOne should throw an exception for an invalid especialidad', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The especialidad with the given id was not found")
  });

  it('create should return a new especialidad', async () => {
    const especialidad: EspecialidadEntity = {
      id: "",
      tipo: faker.helpers.arrayElement(["educativa", "salud", "comportamental"]),
      aniosExperiencia: faker.datatype.number({min: 10000, max: 99999999999}),
      usuario: null
    }
 
    const newEspecialidad: EspecialidadEntity = await service.create(especialidad);
    expect(newEspecialidad).not.toBeNull();
 
    const storedEspecialidad: EspecialidadEntity = await repository.findOne({where: {id: newEspecialidad.id}})
    expect(storedEspecialidad).not.toBeNull();
    expect(storedEspecialidad.tipo).toEqual(newEspecialidad.tipo)
    expect(storedEspecialidad.aniosExperiencia).toEqual(newEspecialidad.aniosExperiencia)
  });

  it('update should modify a especialidad', async () => {
    const especialidad: EspecialidadEntity = especialidadesList[0];
    especialidad.tipo = "educativa";
    especialidad.aniosExperiencia = 3;
     const updatedEspecialidad: EspecialidadEntity = await service.update(especialidad.id, especialidad);
    expect(updatedEspecialidad).not.toBeNull();
     const storedEspecialidad: EspecialidadEntity = await repository.findOne({ where: { id: especialidad.id } })
    expect(storedEspecialidad).not.toBeNull();
    expect(storedEspecialidad.tipo).toEqual(especialidad.tipo)
    expect(storedEspecialidad.aniosExperiencia).toEqual(especialidad.aniosExperiencia)
  });

  it('update should throw an exception for an invalid especialidad', async () => {
    let especialidad: EspecialidadEntity = especialidadesList[0];
    especialidad = {
      ...especialidad, tipo: "educativa", aniosExperiencia: 3
    }
    await expect(() => service.update("0", especialidad)).rejects.toHaveProperty("message", "The especialidad with the given id was not found")
  });

  it('delete should remove a especialidad', async () => {
    const especialidad: EspecialidadEntity = especialidadesList[0];
    await service.delete(especialidad.id);
     const deletedEspecialidad: EspecialidadEntity = await repository.findOne({ where: { id: especialidad.id } })
    expect(deletedEspecialidad).toBeNull();
  });

  it('delete should throw an exception for an invalid especialidad', async () => {
    const especialidad: EspecialidadEntity = especialidadesList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The especialidad with the given id was not found")
  });
});
