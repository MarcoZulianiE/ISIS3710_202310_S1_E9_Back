import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { OfertaEntity } from '../oferta/oferta.entity';
import { Repository } from 'typeorm';
import { UsuarioOfertaService } from './usuario-oferta.service';

import { faker } from '@faker-js/faker';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

describe('UsuarioOfertaService', () => {
  let service: UsuarioOfertaService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let ofertaRepository: Repository<OfertaEntity>;
  let usuario: UsuarioEntity;
  let ofertaList : OfertaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioOfertaService],
    }).compile();

    service = module.get<UsuarioOfertaService>(UsuarioOfertaService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    ofertaRepository = module.get<Repository<OfertaEntity>>(getRepositoryToken(OfertaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    ofertaRepository.clear();
    usuarioRepository.clear();
 
    ofertaList = [];
    for(let i = 0; i < 5; i++){
        const oferta: OfertaEntity = await ofertaRepository.save({
          precio: parseInt(faker.commerce.price(1000,100000, 0)),
          disponible: faker.datatype.boolean(),
          tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
          fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
          fechaFin: faker.date.between("2020-01-01", "2020-12-31")
        })
        ofertaList.push(oferta);
    }
 
    usuario = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      ofertas: ofertaList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addOfertaUsuario should add a oferta to an usuario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });
 
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    const result: UsuarioEntity = await service.addOfertaUsuario(newUsuario.id, newOferta.id);
   
    expect(result.ofertas.length).toBe(1);
    expect(result.ofertas[0]).not.toBeNull();
    expect(result.ofertas[0].precio).toBe(newOferta.precio)
    expect(result.ofertas[0].disponible).toBe(newOferta.disponible)
    expect(result.ofertas[0].tipoOferta).toBe(newOferta.tipoOferta)
    expect(result.ofertas[0].fechaInicio).toEqual(newOferta.fechaInicio)
    expect(result.ofertas[0].fechaFin).toEqual(newOferta.fechaFin)
  });

  it('addOfertaUsuario should thrown exception for an invalid oferta', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    await expect(() => service.addOfertaUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('addOfertaUsuario should thrown exception for an invalid usuario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });
 
    await expect(() => service.addOfertaUsuario("0", newOferta.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('findOfertaByUsuarioIdOfertaId should return oferta by usuario', async () => {
    const oferta: OfertaEntity = ofertaList[0];
    const storedOferta: OfertaEntity = await service.findOfertaByUsuarioIdOfertaId(usuario.id, oferta.id)
    expect(storedOferta).not.toBeNull();
    expect(storedOferta.precio).toBe(oferta.precio)
    expect(storedOferta.disponible).toBe(oferta.disponible)
    expect(storedOferta.tipoOferta).toBe(oferta.tipoOferta)
    expect(storedOferta.fechaInicio).toEqual(oferta.fechaInicio)
    expect(storedOferta.fechaFin).toEqual(oferta.fechaFin)
  });

  it('findOfertaByUsuarioIdOfertaId should throw an exception for an invalid oferta', async () => {
    await expect(()=> service.findOfertaByUsuarioIdOfertaId(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('findOfertaByUsuarioIdOfertaId should throw an exception for an invalid usuario', async () => {
    const oferta: OfertaEntity = ofertaList[0];
    await expect(()=> service.findOfertaByUsuarioIdOfertaId("0", oferta.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('findOfertaByUsuarioIdOfertaId should throw an exception for an oferta not associated to the usuario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });
 
    await expect(()=> service.findOfertaByUsuarioIdOfertaId(usuario.id, newOferta.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "oferta"));
  });

  it('findOfertasByUsuarioId should return ofertas by usuario', async ()=>{
    const ofertas: OfertaEntity[] = await service.findOfertasByUsuarioId(usuario.id);
    expect(ofertas.length).toBe(5)
  });

  it('findOfertasByUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findOfertasByUsuarioId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateOfertasUsuario should update ofertas list for an usuario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });
 
    const updatedUsuario: UsuarioEntity = await service.associateOfertasUsuario(usuario.id, [newOferta]);
    expect(updatedUsuario.ofertas.length).toBe(1);
    expect(updatedUsuario.ofertas[0].precio).toBe(newOferta.precio)
    expect(updatedUsuario.ofertas[0].disponible).toBe(newOferta.disponible)
    expect(updatedUsuario.ofertas[0].tipoOferta).toBe(newOferta.tipoOferta)
    expect(updatedUsuario.ofertas[0].fechaInicio).toEqual(newOferta.fechaInicio)
    expect(updatedUsuario.ofertas[0].fechaFin).toEqual(newOferta.fechaFin)
  });

  it('associateOfertasUsuario should throw an exception for an invalid usuario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });
 
    await expect(()=> service.associateOfertasUsuario("0", [newOferta])).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateOfertasUsuario should throw an exception for an invalid oferta', async () => {
    const newOferta: OfertaEntity = ofertaList[0];
    newOferta.id = "0";
 
    await expect(()=> service.associateOfertasUsuario(usuario.id, [newOferta])).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('deleteOfertaToUsuario should remove a oferta from an usuario', async () => {
    const oferta: OfertaEntity = ofertaList[0];
   
    await service.deleteOfertaUsuario(usuario.id, oferta.id);
 
    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["ofertas"]});
    const deletedOferta: OfertaEntity = storedUsuario.ofertas.find(c => c.id === oferta.id);
 
    expect(deletedOferta).toBeUndefined();
  });

  it('deleteOfertaToUsuario should thrown an exception for an invalid oferta', async () => {
    await expect(()=> service.deleteOfertaUsuario(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('deleteOfertaToUsuario should thrown an exception for an invalid usuario', async () => {
    const oferta: OfertaEntity = ofertaList[0];
    await expect(()=> service.deleteOfertaUsuario("0", oferta.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteOfertaToUsuario should thrown an exception for an non asocciated oferta', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });
 
    await expect(()=> service.deleteOfertaUsuario(usuario.id, newOferta.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "oferta"));
  });

});