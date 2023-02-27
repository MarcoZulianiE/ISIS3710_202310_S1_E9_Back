import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { OfertaEntity } from './oferta.entity';
import { OfertaService } from './oferta.service';

import { faker } from '@faker-js/faker';
import { NotFoundErrorMessage } from '../shared/errors/business-errors';

describe('OfertaService', () => {
  let service: OfertaService;
  let repository: Repository<OfertaEntity>;
  let ofertaList: OfertaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [OfertaService],
    }).compile();

    service = module.get<OfertaService>(OfertaService);
    repository = module.get<Repository<OfertaEntity>>(getRepositoryToken(OfertaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear(); 
    ofertaList = []; 

    for(let i = 0; i < 5; i++){
      const oferta: OfertaEntity = await repository.save({
        precio: parseInt(faker.commerce.price(1000,100000, 0)),
        disponible: faker.datatype.boolean(),
        tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
        fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
        fechaFin: faker.date.between("2020-01-01", "2020-12-31"), })
      ofertaList.push(oferta);
      }
    }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all ofertas', async () => {
    const ofertas: OfertaEntity[] = await service.findAll();
    expect(ofertas).not.toBeNull();
    expect(ofertas).toHaveLength(ofertaList.length);
  });

  it('findOne shoudl return an oferta by id', async () => {
    const storedOferta: OfertaEntity = ofertaList[0];
    const oferta: OfertaEntity = await service.findOne(storedOferta.id);

    expect(oferta).not.toBeNull();
    expect(oferta.precio).toEqual(storedOferta.precio);
    expect(oferta.disponible).toEqual(storedOferta.disponible);
    expect(oferta.tipoOferta).toEqual(storedOferta.tipoOferta);
    expect(oferta.fechaInicio).toEqual(storedOferta.fechaInicio);
    expect(oferta.fechaFin).toEqual(storedOferta.fechaFin);
  });

  it('findOne should throw an exception for an invaild oferta', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('create should create a new oferta', async () => {
    const oferta: OfertaEntity = {
      id: "", 
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31"), 
      horarios: [],
      usuario: null,
      contrato:null,

      // TODO: ask about nulls

    }

    const newOferta: OfertaEntity = await service.create(oferta);
    expect(newOferta).not.toBeNull();

    const storedOferta: OfertaEntity = await repository.findOne({where: {id: newOferta.id}});
    expect(storedOferta).not.toBeNull();
    expect(storedOferta.precio).toEqual(oferta.precio);
    expect(storedOferta.disponible).toEqual(oferta.disponible);
    expect(storedOferta.tipoOferta).toEqual(oferta.tipoOferta);
    expect(storedOferta.fechaInicio).toEqual(oferta.fechaInicio);
    expect(storedOferta.fechaFin).toEqual(oferta.fechaFin);
  
  });

  it('update should modify an oferta',async () => {
    const oferta: OfertaEntity = ofertaList[0]; 
    oferta.precio = 50500; 
    oferta.disponible = false;

    const updatedOferta: OfertaEntity = await service.update(oferta.id, oferta);
    expect(updatedOferta).not.toBeNull();

    const storedOferta: OfertaEntity = await repository.findOne({where: {id: oferta.id}});
    expect(storedOferta).not.toBeNull();
    expect(storedOferta.precio).toEqual(oferta.precio);
    expect(storedOferta.disponible).toEqual(oferta.disponible);
  });

  it('update should throw an exception for an invalid oferta', async () => {
    let oferta: OfertaEntity = ofertaList[0];
    oferta = {
      ...oferta, precio: 50500, disponible: false
    }
    await expect(() => service.update("0", oferta)).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('delete should remove an oferta', async () => {
    const oferta: OfertaEntity = ofertaList[0];
    await service.delete(oferta.id);
  
    const deletedOferta: OfertaEntity = await repository.findOne({ where: { id: oferta.id } })
    expect(deletedOferta).toBeNull();
  });

  it('delete should throw an exception for an invalid oferta', async () => {
    const oferta: OfertaEntity = ofertaList[0];
    await service.delete(oferta.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });


});
