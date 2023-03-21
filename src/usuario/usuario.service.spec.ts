import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';

import { faker } from '@faker-js/faker';
import { NotFoundErrorMessage } from '../shared/errors/business-errors';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuarioList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    usuarioList = [];
    for(let i = 0; i < 5; i++){
        const usuario: UsuarioEntity = await repository.save({
        cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
        contrasenia: faker.internet.password(),
        nombre: faker.name.fullName(),
        correoElectronico: faker.internet.email(),
        direccion: faker.address.streetAddress(),
        celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
        tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"])})
        usuarioList.push(usuario);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all usuarios', async () => {
    const usuarios: UsuarioEntity[] = await service.findAll();
    expect(usuarios).not.toBeNull();
    expect(usuarios).toHaveLength(usuarioList.length);
  });

  it('findOne should return an usuario by id', async () => {
    const storedUsuario: UsuarioEntity = usuarioList[0];
    const usuario: UsuarioEntity = await service.findOne(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.cedula).toEqual(storedUsuario.cedula)
    expect(usuario.contrasenia).toEqual(storedUsuario.contrasenia)
    expect(usuario.nombre).toEqual(storedUsuario.nombre)
    expect(usuario.correoElectronico).toEqual(storedUsuario.correoElectronico)
    expect(usuario.direccion).toEqual(storedUsuario.direccion)
    expect(usuario.celular).toEqual(storedUsuario.celular)
    expect(usuario.tipoUsuario).toEqual(storedUsuario.tipoUsuario)
  });

  it('findOne should throw an exception for an invalid usuario', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"))
  });

  it('create should return a new usuario', async () => {
    const usuario: UsuarioEntity = {
      id: "",
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      roles: ["admin"],
      necesidades: [],
      especialidades: [],
      reseniasRecibidas: [],
      reseniasEscritas: [],
      antecedentes: [],
      contratos: [],
      ofertas: []
    }
 
    const newUsuario: UsuarioEntity = await service.create(usuario);
    expect(newUsuario).not.toBeNull();
 
    const storedUsuario: UsuarioEntity = await repository.findOne({where: {id: newUsuario.id}})
    expect(usuario).not.toBeNull();
    expect(usuario.cedula).toEqual(storedUsuario.cedula)
    expect(usuario.contrasenia).toEqual(storedUsuario.contrasenia)
    expect(usuario.nombre).toEqual(storedUsuario.nombre)
    expect(usuario.correoElectronico).toEqual(storedUsuario.correoElectronico)
    expect(usuario.direccion).toEqual(storedUsuario.direccion)
    expect(usuario.celular).toEqual(storedUsuario.celular)
    expect(usuario.tipoUsuario).toEqual(storedUsuario.tipoUsuario)
  });

  it('create should throw an exception for an invalid tipoUsuario', async () => {
    const usuario: UsuarioEntity = {
      id: "",
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: "panda",
      roles: ["admin"],
      necesidades: [],
      especialidades: [],
      reseniasRecibidas: [],
      reseniasEscritas: [],
      antecedentes: [],
      contratos: [],
      ofertas: []
    }
 
    await expect(() => service.create(usuario)).rejects.toHaveProperty("message", "El tipo de usuario debe ser 'canguro', 'acudiente' o 'ambos'");
  });

  it('create should throw an exception for a repeated email', async () => {
    const usuario: UsuarioEntity = {
      id: "",
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: "canguros@gmail.com",
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: "canguro",
      roles: ["admin"],
      necesidades: [],
      especialidades: [],
      reseniasRecibidas: [],
      reseniasEscritas: [],
      antecedentes: [],
      contratos: [],
      ofertas: []
    }

    await service.create(usuario); 

    const repeatedUsuario: UsuarioEntity = {
      id: "",
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: "canguros@gmail.com",
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: "canguro",
      roles: ["admin"],
      necesidades: [],
      especialidades: [],
      reseniasRecibidas: [],
      reseniasEscritas: [],
      antecedentes: [],
      contratos: [],
      ofertas: []
    }
 
    await expect(() => service.create(repeatedUsuario)).rejects.toHaveProperty("message", "Ya existe un usuario con el correo electronico " + repeatedUsuario.correoElectronico);
  });

  it('create should throw an exception for an invalid cedula, contrasenia or nombre', async () => {
    const usuario: UsuarioEntity = {
      id: "",
      cedula: null,
      contrasenia: null,
      nombre: null,
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      roles: ["admin"],
      necesidades: [],
      especialidades: [],
      reseniasRecibidas: [],
      reseniasEscritas: [],
      antecedentes: [],
      contratos: [],
      ofertas: []
    }
 
    await expect(() => service.create(usuario)).rejects.toHaveProperty("message", "El usuario debe tener minimo una cedula, una contrasenia y un nombre");
  });

  it('update should modify an usuario', async () => {
    const usuario: UsuarioEntity = usuarioList[0];
    usuario.cedula = "123456";
    usuario.contrasenia = "New contrasenia";
    const updatedUsuario: UsuarioEntity = await service.update(usuario.id, usuario);
    expect(updatedUsuario).not.toBeNull();
    const storedUsuario: UsuarioEntity = await repository.findOne({where: {id: usuario.id}})
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.cedula).toEqual(usuario.cedula)
    expect(storedUsuario.cedula).toEqual(usuario.cedula)
  });

  it('update should throw an exception for an invalid usuario', async () => {
    let usuario: UsuarioEntity = usuarioList[0];
    usuario = {
      ...usuario, cedula: "123456", contrasenia: "New contrasenia"
    }
    await expect(() => service.update("0", usuario)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"))
  });

  it('delete should remove an usuario', async () => {
    const usuario: UsuarioEntity = usuarioList[0];
    await service.delete(usuario.id);
    const deletedUsuario: UsuarioEntity = await repository.findOne({ where: { id: usuario.id } })
    expect(deletedUsuario).toBeNull();
  });

  it('delete should throw an exception for an invalid usuario', async () => {
    const usuario: UsuarioEntity = usuarioList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"))
  });

});
