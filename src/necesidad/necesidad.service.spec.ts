import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { NecesidadEntity } from './necesidad.entity';
import { NecesidadService } from './necesidad.service';


describe('NecesidadService', () => {
  let service: NecesidadService;
  let repository: Repository<NecesidadEntity>;
  let necesidadesList: NecesidadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports : [...TypeOrmTestingConfig()],
      providers: [NecesidadService],
    }).compile();

    service = module.get<NecesidadService>(NecesidadService);
    repository = module.get<Repository<NecesidadEntity>>(getRepositoryToken(NecesidadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    necesidadesList = [];
    for(let i = 0; i < 5; i++){
        const necesidad: NecesidadEntity = await repository.save({
        tipo: faker.helpers.arrayElement(["educativa", "salud","comportamental"]),
        descripcion: faker.lorem.sentence()})
        necesidadesList.push(necesidad);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all necesidades', async () => {
    const necesidad: NecesidadEntity[] = await service.findAll();
    expect(necesidad).not.toBeNull();
    expect(necesidad).toHaveLength(necesidadesList.length);
  });

  it('findOne should return a necesidad by id', async () => {
    const storedNecesidad: NecesidadEntity = necesidadesList[0];
    const necesidad: NecesidadEntity = await service.findOne(storedNecesidad.id);
    expect(necesidad).not.toBeNull();
    expect(necesidad.tipo).toEqual(storedNecesidad.tipo)
    expect(necesidad.descripcion).toEqual(storedNecesidad.descripcion)
  });
  
  it('findOne should throw an exception for an invalid necesidad', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The necesidad with the given id was not found")
  });

  it('create should return a new necesidad', async () => {
    const necesidad: NecesidadEntity = {
      id: "",
      tipo: faker.helpers.arrayElement(["educativa", "salud", "comportamental"]),
      descripcion: faker.lorem.sentence(),
      usuario: null
    }
 
    const newNecesidad: NecesidadEntity = await service.create(necesidad);
    expect(newNecesidad).not.toBeNull();
 
    const storedNecesidad: NecesidadEntity = await repository.findOne({where: {id: newNecesidad.id}})
    expect(storedNecesidad).not.toBeNull();
    expect(storedNecesidad.tipo).toEqual(newNecesidad.tipo)
    expect(storedNecesidad.descripcion).toEqual(newNecesidad.descripcion)
  });

  it('update should modify a necesidad', async () => {
    const necesidad: NecesidadEntity = necesidadesList[0];
    necesidad.tipo = "educativa";
    necesidad.descripcion = "Nueva descripcion";
     const updatedNecesidad: NecesidadEntity = await service.update(necesidad.id, necesidad);
    expect(updatedNecesidad).not.toBeNull();
     const storedNecesidad: NecesidadEntity = await repository.findOne({ where: { id: necesidad.id } })
    expect(storedNecesidad).not.toBeNull();
    expect(storedNecesidad.tipo).toEqual(necesidad.tipo)
    expect(storedNecesidad.descripcion).toEqual(necesidad.descripcion)
  });

  it('update should throw an exception for an invalid necesidad', async () => {
    let necesidad: NecesidadEntity = necesidadesList[0];
    necesidad = {
      ...necesidad, tipo: "educativa", descripcion: "Nueva descripcion"
    }
    await expect(() => service.update("0", necesidad)).rejects.toHaveProperty("message", "The necesidad with the given id was not found")
  });

  it('delete should remove a necesidad', async () => {
    const necesidad: NecesidadEntity = necesidadesList[0];
    await service.delete(necesidad.id);
     const deletedNecesidad: NecesidadEntity = await repository.findOne({ where: { id: necesidad.id } })
    expect(deletedNecesidad).toBeNull();
  });

  it('delete should throw an exception for an invalid necesidad', async () => {
    const necesidad: NecesidadEntity = necesidadesList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The necesidad with the given id was not found")
  });
});