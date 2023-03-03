import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContratoEntity } from './contrato.entity';
import { ContratoService } from './contrato.service';

import { NotFoundErrorMessage } from '../shared/errors/business-errors';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

import { faker } from '@faker-js/faker';
import { OfertaEntity } from '../oferta/oferta.entity';

describe('ContratoService', () => {
  let service: ContratoService;
  let contratoRepository: Repository<ContratoEntity>;
  let ofertaRepository: Repository<OfertaEntity>;
  let contratoList: ContratoEntity[];
  let oferta: OfertaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ContratoService],
    }).compile();

    service = module.get<ContratoService>(ContratoService);
    contratoRepository = module.get<Repository<ContratoEntity>>(getRepositoryToken(ContratoEntity));
    ofertaRepository = module.get<Repository<OfertaEntity>>(getRepositoryToken(OfertaEntity));

    await seedDatabase();

  });

  const seedDatabase = async () => {
    contratoRepository.clear();
    ofertaRepository.clear();
    contratoList = [];

    for(let i = 0; i < 5; i++){
      const contrato: ContratoEntity = await contratoRepository.save({
        fecha: faker.date.between('2015-01-01', '2020-12-31'),
      });
      contratoList.push(contrato);
    }

    oferta = await ofertaRepository.save({
      id: "", 
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31"), 
      horarios: [],
      usuario: null,
      contrato:null,
    })
    
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all contratos', async () => {
    const contratos: ContratoEntity[] = await service.findAll();
    expect(contratos).not.toBeNull();
    expect(contratos).toHaveLength(contratoList.length);
  });

  it('findOne should return a contrato by id', async () => {
    const storedContrato: ContratoEntity = contratoList[0];
    const contrato: ContratoEntity = await service.findOne(storedContrato.id);

    expect(contrato).not.toBeNull();
    expect(contrato.id).toEqual(storedContrato.id);
    expect(contrato.fecha).toEqual(storedContrato.fecha);
  });

  it('findOne should throw an exception for an invaild contrato', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('create should return a new contrato', async () => {
    const contrato: ContratoEntity = {
      id: "", 
      fecha: faker.date.between('2015-01-01', '2020-12-31'),
      usuario: null,
      oferta: null,
    }

    const newContrato: ContratoEntity = await service.create(oferta.id, contrato);
    expect(newContrato).not.toBeNull();

    const storedContrato: ContratoEntity = await contratoRepository.findOne({where: {id: newContrato.id}});
    expect(storedContrato).not.toBeNull();

    expect(storedContrato.id).toEqual(newContrato.id);
    expect(storedContrato.fecha).toEqual(newContrato.fecha);

  });

  it('create should throw an exception for an invalid oferta', async () => {
    const contrato: ContratoEntity = {
      id: "", 
      fecha: faker.date.between('2015-01-01', '2020-12-31'),
      usuario: null,
      oferta: null,
    }
    
    await expect(() => service.create("0", contrato)).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('update should modify a contrato', async () => {
    const contrato: ContratoEntity = contratoList[0];
    contrato.fecha = new Date('2019-01-01');

    const updatedContrato: ContratoEntity = await service.update(contrato.id, contrato);
    expect(updatedContrato).not.toBeNull();

    const storedContrato: ContratoEntity = await contratoRepository.findOne({where: {id: contrato.id}});
    expect(storedContrato).not.toBeNull();
    expect(storedContrato.fecha).toEqual(contrato.fecha);
  });

  it('update should throw an exception for an invalid contrato', async () => {
    let contrato: ContratoEntity = contratoList[0];
    contrato = {
      ...contrato, fecha: new Date('2019-01-01')
    }
    await expect(() => service.update("0", contrato)).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('delete should remove a contrato', async () => {
    const contrato: ContratoEntity = contratoList[0];
    await service.delete(contrato.id);
  
    const deletedContrato: ContratoEntity = await contratoRepository.findOne({ where: { id: contrato.id } })
    expect(deletedContrato).toBeNull();
  });

  it('delete should throw an exception for an invalid contrato', async () => {
    const contrato: ContratoEntity = contratoList[0];
    await service.delete(contrato.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });



});
