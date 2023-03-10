/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundErrorMessage } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReseniaEntity } from './resenia.entity';
import { ReseniaService } from './resenia.service';

describe('ReseniaService', () => {
  let service: ReseniaService;
  let repository: Repository<ReseniaEntity>;
  let reseniaList: ReseniaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReseniaService],
    }).compile();

    service = module.get<ReseniaService>(ReseniaService);
    repository = module.get<Repository<ReseniaEntity>>(getRepositoryToken(ReseniaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    reseniaList = [];
    for(let i = 0; i < 5; i++){
        const resenia: ReseniaEntity = await repository.save({
        titulo: faker.lorem.sentence(),
        calificacion: faker.datatype.number({min: 0, max: 5}),
        descripcion: faker.lorem.sentence()})
        reseniaList.push(resenia);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all resenia', async () => {
    const resenia: ReseniaEntity[] = await service.findAll();
    expect(resenia).not.toBeNull();
    expect(resenia).toHaveLength(reseniaList.length);
  }); 

  it('findOne should return an resenia by id', async () => {
    const storedResenia: ReseniaEntity = reseniaList[0];
    const resenia: ReseniaEntity = await service.findOne(storedResenia.id);
    expect(resenia).not.toBeNull();
    expect(resenia.titulo).toEqual(storedResenia.titulo);
    expect(resenia.calificacion).toEqual(storedResenia.calificacion);
    expect(resenia.descripcion).toEqual(storedResenia.descripcion);
  });

  it('findOne should throw an exception for an invalid resenia', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"))
  });

  it('create should return an new resenia', async () => {
    const resenia: ReseniaEntity = {
      id: "",
      titulo: faker.lorem.sentence(),
      calificacion: faker.datatype.number({ min: 0, max: 5 }),
      descripcion: faker.lorem.sentence(),
      receptor: null,
      autor: null,
    }
 
    const newResenia: ReseniaEntity = await service.create(resenia);
    expect(newResenia).not.toBeNull();
 
    const storedResenia: ReseniaEntity = await repository.findOne({where: {id: newResenia.id}})
    expect(storedResenia).not.toBeNull();
    expect(storedResenia.titulo).toEqual(newResenia.titulo);
    expect(storedResenia.calificacion).toEqual(newResenia.calificacion);
    expect(storedResenia.descripcion).toEqual(newResenia.descripcion);
  });

  it('update should modify an resenia', async () => {
    const resenia: ReseniaEntity = reseniaList[0];
    resenia.titulo = "Buena profecional";
    const updatedResenia: ReseniaEntity = await service.update(resenia.id, resenia);
    expect(updatedResenia).not.toBeNull();
    const storedResenia: ReseniaEntity = await repository.findOne({ where: { id: resenia.id } })
    expect(storedResenia).not.toBeNull();
    expect(storedResenia.titulo).toEqual(resenia.titulo)
  });

  it('update should throw an exception for an invalid resenia', async () => {
    let resenia: ReseniaEntity = reseniaList[0];
    resenia = {
      ...resenia, titulo: "Buena profecional"
    }
    await expect(() => service.update("0", resenia)).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"))
  });

  it('delete should remove a resenia', async () => {
    const resenia: ReseniaEntity = reseniaList[0];
    await service.delete(resenia.id);
     const deletedResenia: ReseniaEntity = await repository.findOne({ where: { id: resenia.id } })
    expect(deletedResenia).toBeNull();
  });

  it('delete should throw an exception for an invalid resenia', async () => {
    const resenia: ReseniaEntity = reseniaList[0];
    await service.delete(resenia.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"))
  });
});