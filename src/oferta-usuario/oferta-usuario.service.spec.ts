import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { OfertaEntity } from '../oferta/oferta.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import { OfertaUsuarioService } from './oferta-usuario.service';

import { faker } from '@faker-js/faker';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

describe('OfertaUsuarioService', () => {
  let service: OfertaUsuarioService;
  let ofertaRepository: Repository<OfertaEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let oferta: OfertaEntity;
  let usuario : UsuarioEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [OfertaUsuarioService],
    }).compile();

    service = module.get<OfertaUsuarioService>(OfertaUsuarioService);
    ofertaRepository = module.get<Repository<OfertaEntity>>(getRepositoryToken(OfertaEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    usuarioRepository.clear();
    ofertaRepository.clear();
 
    usuario = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })

    oferta = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31"),
      usuario: usuario
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addUsuarioOferta should add an usuario to a oferta', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
    
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });
 
    const result: OfertaEntity = await service.addUsuarioOferta(newOferta.id, newUsuario.id);
   
    expect(result.usuario).not.toBeNull();
    expect(result.usuario.cedula).toBe(newUsuario.cedula)
    expect(result.usuario.contrasenia).toBe(newUsuario.contrasenia)
    expect(result.usuario.nombre).toBe(newUsuario.nombre)
    expect(result.usuario.correoElectronico).toBe(newUsuario.correoElectronico)
    expect(result.usuario.direccion).toBe(newUsuario.direccion)
    expect(result.usuario.celular).toBe(newUsuario.celular)
    expect(result.usuario.tipoUsuario).toBe(newUsuario.tipoUsuario)
  });

  it('addUsuarioOferta should thrown exception for an invalid usuario', async () => {
    const newOferta: OfertaEntity = await ofertaRepository.save({
      precio: parseInt(faker.commerce.price(1000,100000, 0)),
      disponible: faker.datatype.boolean(),
      tipoOferta: faker.helpers.arrayElement(["canguro", "acudiente"]),
      fechaInicio: faker.date.between("2020-01-01", "2020-12-31"),
      fechaFin: faker.date.between("2020-01-01", "2020-12-31")
    });
    await expect(() => service.addUsuarioOferta(newOferta.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('addUsuarioOferta should thrown exception for an invalid oferta', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    await expect(() => service.addUsuarioOferta("0", newUsuario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('findUsuarioByOfertaIdUsuarioId should return usuario by oferta', async () => {
    const storedUsuario: UsuarioEntity = await service.findUsuarioByOfertaIdUsuarioId(oferta.id, usuario.id)
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.cedula).toBe(usuario.cedula)
    expect(storedUsuario.contrasenia).toBe(usuario.contrasenia)
    expect(storedUsuario.nombre).toBe(usuario.nombre)
    expect(storedUsuario.correoElectronico).toBe(usuario.correoElectronico)
    expect(storedUsuario.direccion).toBe(usuario.direccion)
    expect(storedUsuario.celular).toBe(usuario.celular)
    expect(storedUsuario.tipoUsuario).toBe(usuario.tipoUsuario)
  });
  
  it('findUsuarioByOfertaIdUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findUsuarioByOfertaIdUsuarioId(oferta.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });
  
  it('findUsuarioByOfertaIdUsuarioId should throw an exception for an invalid oferta', async () => {
    await expect(()=> service.findUsuarioByOfertaIdUsuarioId("0", usuario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('findUsuarioByOfertaIdUsuarioId should throw an exception for an usuario not associated to the oferta', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    await expect(()=> service.findUsuarioByOfertaIdUsuarioId(oferta.id, newUsuario.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("oferta", "usuario"));
  });

  it('findUsuarioByOfertaId should return usuario by oferta', async ()=>{
    const usuarioEntity: UsuarioEntity = await service.findUsuarioByOfertaId(oferta.id);
    expect(usuarioEntity).not.toBeNull();
    expect(usuarioEntity.cedula).toBe(usuario.cedula)
    expect(usuarioEntity.contrasenia).toBe(usuario.contrasenia)
    expect(usuarioEntity.nombre).toBe(usuario.nombre)
    expect(usuarioEntity.correoElectronico).toBe(usuario.correoElectronico)
    expect(usuarioEntity.direccion).toBe(usuario.direccion)
    expect(usuarioEntity.celular).toBe(usuario.celular)
    expect(usuarioEntity.tipoUsuario).toBe(usuario.tipoUsuario)
  });

  it('findUsuarioByOfertaId should throw an exception for an invalid oferta', async () => {
    await expect(()=> service.findUsuarioByOfertaId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('associateUsuarioOferta should update usuario for a oferta', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })

    const updatedOferta: OfertaEntity = await service.associateUsuarioOferta(oferta.id, newUsuario);
    expect(updatedOferta.usuario.cedula).toBe(newUsuario.cedula)
    expect(updatedOferta.usuario.contrasenia).toBe(newUsuario.contrasenia)
    expect(updatedOferta.usuario.nombre).toBe(newUsuario.nombre)
    expect(updatedOferta.usuario.correoElectronico).toBe(newUsuario.correoElectronico)
    expect(updatedOferta.usuario.direccion).toBe(newUsuario.direccion)
    expect(updatedOferta.usuario.celular).toBe(newUsuario.celular)
    expect(updatedOferta.usuario.tipoUsuario).toBe(newUsuario.tipoUsuario)
  });

  it('associateUsuarioOferta should throw an exception for an invalid oferta', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })

    await expect(()=> service.associateUsuarioOferta("0", newUsuario)).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('associateUsuarioOferta should throw an exception for an invalid usuario', async () => {
    const newUsuario: UsuarioEntity = usuario;
    newUsuario.id = "0";
 
    await expect(()=> service.associateUsuarioOferta(oferta.id, usuario)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteUsuarioToOferta should remove the usuario from a oferta', async () => {
   
    await service.deleteUsuarioOferta(oferta.id, usuario.id);
 
    const storedOferta: OfertaEntity = await ofertaRepository.findOne({where: {id: oferta.id}, relations: ["usuario"]});
    const deletedUsuario: UsuarioEntity = storedOferta.usuario;
 
    expect(deletedUsuario).toBeNull();
  });

  it('deleteUsuarioToOferta should thrown an exception for an invalid usuario', async () => {
    await expect(()=> service.deleteUsuarioOferta(oferta.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteUsuarioToOferta should thrown an exception for an invalid oferta', async () => {
    await expect(()=> service.deleteUsuarioOferta("0", usuario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("oferta"));
  });

  it('deleteUsuarioToOferta should thrown an exception for an non asocciated usuario', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    await expect(()=> service.deleteUsuarioOferta(oferta.id, newUsuario.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("oferta", "usuario"));
  });

});
