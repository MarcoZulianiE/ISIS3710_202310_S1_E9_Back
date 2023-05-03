import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContratoEntity } from '../contrato/contrato.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ContratoUsuarioService } from './contrato-usuario.service';

import { faker } from '@faker-js/faker';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

describe('ContratoUsuarioService', () => {
  let service: ContratoUsuarioService;
  let contratoRepository: Repository<ContratoEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let contrato: ContratoEntity;
  let usuario : UsuarioEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ContratoUsuarioService],
    }).compile();

    service = module.get<ContratoUsuarioService>(ContratoUsuarioService);
    contratoRepository = module.get<Repository<ContratoEntity>>(getRepositoryToken(ContratoEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    usuarioRepository.clear();
    contratoRepository.clear();
 
    usuario = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      foto: faker.image.imageUrl(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      aniosExperiencia: faker.datatype.number({min: 0, max: 100}),
      roles: ["admin"],
    })

    contrato = await contratoRepository.save({
      fecha: faker.date.between('2015-01-01', '2020-12-31'),
      usuario: usuario
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addUsuarioContrato should add an usuario to a contrato', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      foto: faker.image.imageUrl(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      aniosExperiencia: faker.datatype.number({min: 0, max: 100}),
      roles: ["admin"],
    })
    
    const newContrato: ContratoEntity = await contratoRepository.save({
      fecha: faker.date.between('2015-01-01', '2020-12-31')
    });
 
    const result: ContratoEntity = await service.addUsuarioContrato(newContrato.id, newUsuario.id);
   
    expect(result.usuario).not.toBeNull();
    expect(result.usuario.cedula).toBe(newUsuario.cedula)
    expect(result.usuario.contrasenia).toBe(newUsuario.contrasenia)
    expect(result.usuario.nombre).toBe(newUsuario.nombre)
    expect(result.usuario.correoElectronico).toBe(newUsuario.correoElectronico)
    expect(result.usuario.direccion).toBe(newUsuario.direccion)
    expect(result.usuario.celular).toBe(newUsuario.celular)
    expect(result.usuario.tipoUsuario).toBe(newUsuario.tipoUsuario)
  });

  it('addUsuarioContrato should thrown exception for an invalid usuario', async () => {
    const newContrato: ContratoEntity = await contratoRepository.save({
      fecha: faker.date.between('2015-01-01', '2020-12-31')
    });
    await expect(() => service.addUsuarioContrato(newContrato.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('addUsuarioContrato should thrown exception for an invalid contrato', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      foto: faker.image.imageUrl(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      aniosExperiencia: faker.datatype.number({min: 0, max: 100}),
      roles: ["admin"],
    })
 
    await expect(() => service.addUsuarioContrato("0", newUsuario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('findUsuarioByContratoIdUsuarioId should return usuario by contrato', async () => {
    const storedUsuario: UsuarioEntity = await service.findUsuarioByContratoIdUsuarioId(contrato.id, usuario.id)
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.cedula).toBe(usuario.cedula)
    expect(storedUsuario.contrasenia).toBe(usuario.contrasenia)
    expect(storedUsuario.nombre).toBe(usuario.nombre)
    expect(storedUsuario.correoElectronico).toBe(usuario.correoElectronico)
    expect(storedUsuario.direccion).toBe(usuario.direccion)
    expect(storedUsuario.celular).toBe(usuario.celular)
    expect(storedUsuario.tipoUsuario).toBe(usuario.tipoUsuario)
  });
  
  it('findUsuarioByContratoIdUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findUsuarioByContratoIdUsuarioId(contrato.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });
  
  it('findUsuarioByContratoIdUsuarioId should throw an exception for an invalid contrato', async () => {
    await expect(()=> service.findUsuarioByContratoIdUsuarioId("0", usuario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('findUsuarioByContratoIdUsuarioId should throw an exception for an usuario not associated to the contrato', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      foto: faker.image.imageUrl(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      aniosExperiencia: faker.datatype.number({min: 0, max: 100}),
      roles: ["admin"],
    })
 
    await expect(()=> service.findUsuarioByContratoIdUsuarioId(contrato.id, newUsuario.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("contrato", "usuario"));
  });

  it('findUsuarioByContratoId should return usuario by contrato', async ()=>{
    const usuarioEntity: UsuarioEntity = await service.findUsuarioByContratoId(contrato.id);
    expect(usuarioEntity).not.toBeNull();
    expect(usuarioEntity.cedula).toBe(usuario.cedula)
    expect(usuarioEntity.contrasenia).toBe(usuario.contrasenia)
    expect(usuarioEntity.nombre).toBe(usuario.nombre)
    expect(usuarioEntity.correoElectronico).toBe(usuario.correoElectronico)
    expect(usuarioEntity.direccion).toBe(usuario.direccion)
    expect(usuarioEntity.celular).toBe(usuario.celular)
    expect(usuarioEntity.tipoUsuario).toBe(usuario.tipoUsuario)
  });

  it('findUsuarioByContratoId should throw an exception for an invalid contrato', async () => {
    await expect(()=> service.findUsuarioByContratoId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('associateUsuarioContrato should update usuario for a contrato', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      foto: faker.image.imageUrl(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      aniosExperiencia: faker.datatype.number({min: 0, max: 100}),
      roles: ["admin"],
    })

    const updatedContrato: ContratoEntity = await service.associateUsuarioContrato(contrato.id, newUsuario);
    expect(updatedContrato.usuario.cedula).toBe(newUsuario.cedula)
    expect(updatedContrato.usuario.contrasenia).toBe(newUsuario.contrasenia)
    expect(updatedContrato.usuario.nombre).toBe(newUsuario.nombre)
    expect(updatedContrato.usuario.correoElectronico).toBe(newUsuario.correoElectronico)
    expect(updatedContrato.usuario.direccion).toBe(newUsuario.direccion)
    expect(updatedContrato.usuario.celular).toBe(newUsuario.celular)
    expect(updatedContrato.usuario.tipoUsuario).toBe(newUsuario.tipoUsuario)
  });

  it('associateUsuarioContrato should throw an exception for an invalid contrato', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      foto: faker.image.imageUrl(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      aniosExperiencia: faker.datatype.number({min: 0, max: 100}),
      roles: ["admin"],
    })

    await expect(()=> service.associateUsuarioContrato("0", newUsuario)).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('associateUsuarioContrato should throw an exception for an invalid usuario', async () => {
    const newUsuario: UsuarioEntity = usuario;
    newUsuario.id = "0";
 
    await expect(()=> service.associateUsuarioContrato(contrato.id, usuario)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteUsuarioToContrato should remove the usuario from a contrato', async () => {
   
    await service.deleteUsuarioContrato(contrato.id, usuario.id);
 
    const storedContrato: ContratoEntity = await contratoRepository.findOne({where: {id: contrato.id}, relations: ["usuario"]});
    const deletedUsuario: UsuarioEntity = storedContrato.usuario;
 
    expect(deletedUsuario).toBeNull();
  });

  it('deleteUsuarioToContrato should thrown an exception for an invalid usuario', async () => {
    await expect(()=> service.deleteUsuarioContrato(contrato.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteUsuarioToContrato should thrown an exception for an invalid contrato', async () => {
    await expect(()=> service.deleteUsuarioContrato("0", usuario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('deleteUsuarioToContrato should thrown an exception for an non asocciated usuario', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      foto: faker.image.imageUrl(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      aniosExperiencia: faker.datatype.number({min: 0, max: 100}),
      roles: ["admin"],
    })
 
    await expect(()=> service.deleteUsuarioContrato(contrato.id, newUsuario.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("contrato", "usuario"));
  });

});
