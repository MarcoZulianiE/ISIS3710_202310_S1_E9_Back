/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AntecedenteEntity } from './antecedente.entity';
import { AntecedenteService } from './antecedente.service';
import { NotFoundErrorMessage } from '../shared/errors/business-errors';

describe('AntecedenteService', () => {
  let service: AntecedenteService;
  let repository: Repository<AntecedenteEntity>;
  let antecedenteList: AntecedenteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AntecedenteService],
    }).compile();

    service = module.get<AntecedenteService>(AntecedenteService);
    repository = module.get<Repository<AntecedenteEntity>>(getRepositoryToken(AntecedenteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    antecedenteList = [];
    for(let i = 0; i < 5; i++){
        const antecedente: AntecedenteEntity = await repository.save({
        tipo: faker.helpers.arrayElement(["judiciales", "disciplinarios","fiscales"]),
        descripcion: faker.lorem.sentence()})
        antecedenteList.push(antecedente);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all antecedentes', async () => {
    const antecedente: AntecedenteEntity[] = await service.findAll();
    expect(antecedente).not.toBeNull();
    expect(antecedente).toHaveLength(antecedenteList.length);
  });

  it('findOne should return an antecedente by id', async () => {
    const storedAntecedente: AntecedenteEntity = antecedenteList[0];
    const antecedente: AntecedenteEntity = await service.findOne(storedAntecedente.id);
    expect(antecedente).not.toBeNull();
    expect(antecedente.tipo).toEqual(storedAntecedente.tipo);
    expect(antecedente.descripcion).toEqual(storedAntecedente.descripcion);
  });

  it('findOne should throw an exception for an invalid antecedente', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("antecedente"))
  });

  it('create should return an new antecedente', async () => {
    const antecedente: AntecedenteEntity = {
      id: "",
      tipo: faker.helpers.arrayElement(["judiciales", "disciplinarios", "fiscales"]),
      descripcion: faker.lorem.sentence(),
      usuario: null,
    }
 
    const newAntecedente: AntecedenteEntity = await service.create(antecedente);
    expect(newAntecedente).not.toBeNull();
 
    const storedAntecedente: AntecedenteEntity = await repository.findOne({where: {id: newAntecedente.id}})
    expect(storedAntecedente).not.toBeNull();
    expect(storedAntecedente.tipo).toEqual(newAntecedente.tipo);
    expect(storedAntecedente.descripcion).toEqual(newAntecedente.descripcion);
  });

  it('update should modify an antecedente', async () => {
    const antecedente: AntecedenteEntity = antecedenteList[0];
    antecedente.tipo = "fiscal";
    const updatedAntecedente: AntecedenteEntity = await service.update(antecedente.id, antecedente);
    expect(updatedAntecedente).not.toBeNull();
    const storedAntecedente: AntecedenteEntity = await repository.findOne({ where: { id: antecedente.id } })
    expect(storedAntecedente).not.toBeNull();
    expect(storedAntecedente.tipo).toEqual(antecedente.tipo)
  });

  it('update should throw an exception for an invalid antecedente', async () => {
    let antecedente: AntecedenteEntity = antecedenteList[0];
    antecedente = {
      ...antecedente, tipo: "fiscal"
    }
    await expect(() => service.update("0", antecedente)).rejects.toHaveProperty("message", NotFoundErrorMessage("antecedente"))
  });

  it('delete should remove a antecedente', async () => {
    const antecedente: AntecedenteEntity = antecedenteList[0];
    await service.delete(antecedente.id);
     const deletedAntecedente: AntecedenteEntity = await repository.findOne({ where: { id: antecedente.id } })
    expect(deletedAntecedente).toBeNull();
  });

  it('delete should throw an exception for an invalid antecedente', async () => {
    const antecedente: AntecedenteEntity = antecedenteList[0];
    await service.delete(antecedente.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("antecedente"))
  });
});
