/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import { ReseniaUsuarioService } from './resenia-usuario.service';

import { faker } from '@faker-js/faker';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

describe('ReseniaUsuarioService', () => {
  let service: ReseniaUsuarioService;
  let reseniaRepository: Repository<ReseniaEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let resenia: ReseniaEntity;
  let usuario : UsuarioEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReseniaUsuarioService],
    }).compile();

    service = module.get<ReseniaUsuarioService>(ReseniaUsuarioService);
    reseniaRepository = module.get<Repository<ReseniaEntity>>(getRepositoryToken(ReseniaEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    usuarioRepository.clear();
    reseniaRepository.clear();
 
    usuario = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })

    resenia = await reseniaRepository.save({
      titulo: faker.lorem.sentence(),
      calificacion: faker.datatype.number({min: 0, max: 5}),
      descripcion: faker.lorem.sentence()
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addUsuarioResenia should add an usuario to a resenia', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
    
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      titulo: faker.lorem.sentence(),
      calificacion: faker.datatype.number({min: 0, max: 5}),
      descripcion: faker.lorem.sentence()
    });
 
    const result: ReseniaEntity = await service.addUsuarioResenia(newResenia.id, newUsuario.id);
   
    expect(result.autor).not.toBeNull();
    expect(result.autor.cedula).toBe(newUsuario.cedula)
    expect(result.autor.contrasenia).toBe(newUsuario.contrasenia)
    expect(result.autor.nombre).toBe(newUsuario.nombre)
    expect(result.autor.correoElectronico).toBe(newUsuario.correoElectronico)
    expect(result.autor.direccion).toBe(newUsuario.direccion)
    expect(result.autor.celular).toBe(newUsuario.celular)
    expect(result.autor.tipoUsuario).toBe(newUsuario.tipoUsuario)
  });

  it('addUsuarioResenia should thrown exception for an invalid usuario', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      titulo: faker.lorem.sentence(),
      calificacion: faker.datatype.number({min: 0, max: 5}),
      descripcion: faker.lorem.sentence()
    });
    await expect(() => service.addUsuarioResenia(newResenia.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('addUsuarioResenia should thrown exception for an invalid resenia', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    await expect(() => service.addUsuarioResenia("0", newUsuario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"));
  });

  it('findUsuarioByReseniaIdUsuarioId should return usuario by resenia', async () => {
    const storedUsuario: UsuarioEntity = await service.findUsuarioByReseniaIdUsuarioId(resenia.id, usuario.id)
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.cedula).toBe(usuario.cedula)
    expect(storedUsuario.contrasenia).toBe(usuario.contrasenia)
    expect(storedUsuario.nombre).toBe(usuario.nombre)
    expect(storedUsuario.correoElectronico).toBe(usuario.correoElectronico)
    expect(storedUsuario.direccion).toBe(usuario.direccion)
    expect(storedUsuario.celular).toBe(usuario.celular)
    expect(storedUsuario.tipoUsuario).toBe(usuario.tipoUsuario)
  });
  
  it('findUsuarioByReseniaIdUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findUsuarioByReseniaIdUsuarioId(resenia.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });
  
  it('findUsuarioByReseniaIdUsuarioId should throw an exception for an invalid resenia', async () => {
    await expect(()=> service.findUsuarioByReseniaIdUsuarioId("0", usuario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"));
  });

  it('findUsuarioByReseniaIdUsuarioId should throw an exception for an usuario not associated to the resenia', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    await expect(()=> service.findUsuarioByReseniaIdUsuarioId(resenia.id, newUsuario.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("resenia", "usuario"));
  });

  it('findUsuarioByReseniaId should return usuario by resenia', async ()=>{
    const usuarioEntity: UsuarioEntity = await service.findUsuarioByReseniaId(resenia.id);
    expect(usuarioEntity).not.toBeNull();
    expect(usuarioEntity.cedula).toBe(usuario.cedula)
    expect(usuarioEntity.contrasenia).toBe(usuario.contrasenia)
    expect(usuarioEntity.nombre).toBe(usuario.nombre)
    expect(usuarioEntity.correoElectronico).toBe(usuario.correoElectronico)
    expect(usuarioEntity.direccion).toBe(usuario.direccion)
    expect(usuarioEntity.celular).toBe(usuario.celular)
    expect(usuarioEntity.tipoUsuario).toBe(usuario.tipoUsuario)
  });

  it('findUsuarioByReseniaId should throw an exception for an invalid resenia', async () => {
    await expect(()=> service.findUsuarioByReseniaId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"));
  });

  it('associateUsuarioResenia should update usuario for a resenia', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })

    const updatedResenia: ReseniaEntity = await service.associateUsuarioResenia(resenia.id, newUsuario);
    expect(updatedResenia.autor.cedula).toBe(newUsuario.cedula)
    expect(updatedResenia.autor.contrasenia).toBe(newUsuario.contrasenia)
    expect(updatedResenia.autor.nombre).toBe(newUsuario.nombre)
    expect(updatedResenia.autor.correoElectronico).toBe(newUsuario.correoElectronico)
    expect(updatedResenia.autor.direccion).toBe(newUsuario.direccion)
    expect(updatedResenia.autor.celular).toBe(newUsuario.celular)
    expect(updatedResenia.autor.tipoUsuario).toBe(newUsuario.tipoUsuario)
  });

  it('associateUsuarioResenia should throw an exception for an invalid resenia', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })

    await expect(()=> service.associateUsuarioResenia("0", newUsuario)).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"));
  });

  it('associateUsuarioResenia should throw an exception for an invalid usuario', async () => {
    const newUsuario: UsuarioEntity = usuario;
    newUsuario.id = "0";
 
    await expect(()=> service.associateUsuarioResenia(resenia.id, usuario)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteUsuarioToResenia should remove the usuario from a resenia', async () => {
   
    await service.deleteUsuarioResenia(resenia.id, usuario.id);
 
    const storedResenia: ReseniaEntity = await reseniaRepository.findOne({where: {id: resenia.id}, relations: ["usuario"]});
    const deletedUsuario: UsuarioEntity = storedResenia.autor;
 
    expect(deletedUsuario).toBeNull();
  });

  it('deleteUsuarioToResenia should thrown an exception for an invalid usuario', async () => {
    await expect(()=> service.deleteUsuarioResenia(resenia.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteUsuarioToResenia should thrown an exception for an invalid resenia', async () => {
    await expect(()=> service.deleteUsuarioResenia("0", usuario.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"));
  });

  it('deleteUsuarioToResenia should thrown an exception for an non asocciated usuario', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    await expect(()=> service.deleteUsuarioResenia(resenia.id, newUsuario.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("resenia", "usuario"));
  });

});
