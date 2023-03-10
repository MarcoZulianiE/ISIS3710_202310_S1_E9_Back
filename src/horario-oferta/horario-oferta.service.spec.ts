/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioEntity } from '../horario/horario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { HorarioOfertaService } from './horario-oferta.service';


describe('HorarioOfertaService', () => {
  let service: HorarioOfertaService;
  let horarioRepository: Repository<HorarioEntity>;
  let ofertaRepository: Repository<OfertaEntity>;
  let horario: HorarioEntity;
  let oferta : OfertaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [HorarioOfertaService],
    }).compile();

    service = module.get<HorarioOfertaService>(HorarioOfertaService);
    horarioRepository = module.get<Repository<HorarioEntity>>(getRepositoryToken(HorarioEntity));
    ofertaRepository = module.get<Repository<OfertaEntity>>(getRepositoryToken(OfertaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    ofertaRepository.clear();
    horarioRepository.clear();

    oferta = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    })

    horario = await horarioRepository.save({
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
      oferta: oferta
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addOfertaHorario should add an oferta to a horario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });

    const newHorario: HorarioEntity = await horarioRepository.save({
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z')
    })

    const result: HorarioEntity = await service.addOfertaHorario(newHorario.id, newOferta.id);
    
    expect(result.oferta).not.toBeNull();

  });

  it('addOfertaHorario should thrown exception for an invalid oferta', async () => {
    const newHorario: HorarioEntity = await horarioRepository.save({
      dia: faker.date.weekday(),
      horaInicio:faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z'),
      horaFin: faker.date.between('1800-01-01T00:00:00.000Z', '1800-01-02T00:00:00.000Z')
    })

    await expect(() => service.addOfertaHorario(newHorario.id, "0")).rejects.toHaveProperty("message",NotFoundErrorMessage("oferta"));
  });

  it('addOfertaHorario should throw an exception for an invalid horario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });

    await expect(() => service.addOfertaHorario("0", newOferta.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("horario"));
  });

  it('findOfertaByHorarioIdOfertaId should return oferta by horario', async () => {
    const storedOferta: OfertaEntity = await service.findOfertaByHorarioIdOfertaId(horario.id, oferta.id)
    expect(storedOferta).not.toBeNull();
    expect(storedOferta.precio).toBe(oferta.precio);
    expect(storedOferta.disponible).toBe(oferta.disponible);
    expect(storedOferta.tipoOferta).toBe(oferta.tipoOferta);
    expect(storedOferta.fechaInicio).toStrictEqual(oferta.fechaInicio);
    expect(storedOferta.fechaFin).toStrictEqual(oferta.fechaFin);
  });

  it('findOfertaByHorarioIdOfertaId should throw an exception for an invalid oferta', async () => {
    await expect(()=> service.findOfertaByHorarioIdOfertaId(horario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta")); 
  });

  it('findOfertaByHorarioIdOfertaId should throw an exception for an invalid horario', async () => {
    await expect(()=> service.findOfertaByHorarioIdOfertaId("0", oferta.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("horario")); 
  });

  it('findOfertaByHorarioIdOfertaId should throw an exception for an oferta not associated to the horario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });

    await expect(()=> service.findOfertaByHorarioIdOfertaId(horario.id, newOferta.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("horario", "oferta")); 
  });

  it('findOfertasByHorarioId should return oferta by horario', async ()=>{
    const oferta: OfertaEntity = await service.findOfertasByHorarioId(horario.id);
    expect(oferta).not.toBeNull();
  });

  it('findOfertasByHorarioId should throw an exception for an invalid horario', async () => {
    await expect(()=> service.findOfertasByHorarioId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("horario")); 
  });

  it('associateOfertasHorario should update ofertas list for a horario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });

    const updatedHorario: HorarioEntity = await service.associateOfertaHorario(horario.id, newOferta);
    expect(updatedHorario.oferta).not.toBeNull();

    expect(updatedHorario.oferta.precio).toBe(newOferta.precio);
    expect(updatedHorario.oferta.disponible).toBe(newOferta.disponible);
    expect(updatedHorario.oferta.tipoOferta).toBe(newOferta.tipoOferta);
    expect(updatedHorario.oferta.fechaInicio).toStrictEqual(newOferta.fechaInicio);
    expect(updatedHorario.oferta.fechaFin).toStrictEqual(newOferta.fechaFin);
  });

  it('associateOfertasHorario should throw an exception for an invalid horario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });

    await expect(()=> service.associateOfertaHorario("0", newOferta)).rejects.toHaveProperty("message", NotFoundErrorMessage("horario")); 
  });

  it('associateOfertasHorario should throw an exception for an invalid oferta', async () => {
    const newOferta: OfertaEntity = oferta;
    newOferta.id = "0";

    await expect(()=> service.associateOfertaHorario(horario.id, newOferta)).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta")); 
  });

  it('deleteOfertaToHorario should remove an oferta from an horario', async () => {
    
    await service.deleteOfertaHorario(horario.id, oferta.id);

    const storedHorario: HorarioEntity = await horarioRepository.findOne({where: {id: horario.id}, relations: ["oferta"]});
    const deletedOferta: OfertaEntity = storedHorario.oferta;

    expect(deletedOferta).toBeNull();

  });

  it('deleteOfertaToHorario should thrown an exception for an invalid oferta', async () => {
    await expect(()=> service.deleteOfertaHorario(horario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta")); 
  });

  it('deleteOfertaToHorario should thrown an exception for an invalid horario', async () => {
    await expect(()=> service.deleteOfertaHorario("0", oferta.id)).rejects.toHaveProperty("message",NotFoundErrorMessage("horario")); 
  });

  it('deleteOfertaToHorario should thrown an exception for an non asocciated oferta', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });

    await expect(()=> service.deleteOfertaHorario(horario.id, newOferta.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("horario", "oferta")); 
  }); 

});
