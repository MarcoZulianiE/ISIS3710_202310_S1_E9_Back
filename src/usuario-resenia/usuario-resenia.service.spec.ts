/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioReseniaService } from './usuario-resenia.service';

import { faker } from '@faker-js/faker';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

describe('UsuarioReseniaService', () => {
  let service: UsuarioReseniaService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let reseniaRepository: Repository<ReseniaEntity>;
  let usuario: UsuarioEntity;
  let reseniaList : ReseniaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioReseniaService],
    }).compile();

    service = module.get<UsuarioReseniaService>(UsuarioReseniaService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    reseniaRepository = module.get<Repository<ReseniaEntity>>(getRepositoryToken(ReseniaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    reseniaRepository.clear();
    usuarioRepository.clear();
 
    reseniaList = [];
    for(let i = 0; i < 5; i++){
        const resenia: ReseniaEntity = await reseniaRepository.save({
          titulo: faker.lorem.sentence(),
          calificacion: faker.datatype.number({min: 0, max: 5}),
          descripcion: faker.lorem.sentence()
        })
        reseniaList.push(resenia);
    }
 
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
      reseniasRecibidas: reseniaList
    })

    reseniaList[0].receptor = usuario;

  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addReseniaUsuario should add a resenia to an usuario', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      titulo: faker.lorem.sentence(),
      calificacion: faker.datatype.number({min: 0, max: 5}),
      descripcion: faker.lorem.sentence()
    });
 
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
 
    const result: UsuarioEntity = await service.addReseniaUsuario(newUsuario.id, newResenia.id);
   
    expect(result.reseniasRecibidas.length).toBe(1);
    expect(result.reseniasRecibidas[0]).not.toBeNull();
    expect(result.reseniasRecibidas[0].titulo).toEqual(newResenia.titulo);
    expect(result.reseniasRecibidas[0].calificacion).toEqual(newResenia.calificacion);
    expect(result.reseniasRecibidas[0].descripcion).toEqual(newResenia.descripcion);
  });

  it('addReseniaUsuario should thrown exception for an invalid resenia', async () => {
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
 
    await expect(() => service.addReseniaUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"));
  });

  it('addReseniaUsuario should thrown exception for an invalid usuario', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      titulo: faker.lorem.sentence(),
      calificacion: faker.datatype.number({min: 0, max: 5}),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(() => service.addReseniaUsuario("0", newResenia.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('findReseniaByUsuarioIdReseniaId should return resenia by usuario', async () => {
    const resenia: ReseniaEntity = reseniaList[0];
    const storedResenia: ReseniaEntity = await service.findReseniaByUsuarioIdReseniaId(usuario.id, resenia.id)
    expect(storedResenia).not.toBeNull();
    expect(storedResenia.titulo).toEqual(resenia.titulo);
    expect(storedResenia.calificacion).toEqual(resenia.calificacion);
    expect(storedResenia.descripcion).toEqual(resenia.descripcion);
  });

  it('findReseniaByUsuarioIdReseniaId should throw an exception for an invalid resenia', async () => {
    await expect(()=> service.findReseniaByUsuarioIdReseniaId(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"));
  });

  it('findReseniaByUsuarioIdReseniaId should throw an exception for an invalid usuario', async () => {
    const resenia: ReseniaEntity = reseniaList[0];
    await expect(()=> service.findReseniaByUsuarioIdReseniaId("0", resenia.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('findReseniaByUsuarioIdReseniaId should throw an exception for an resenia not associated to the usuario', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      titulo: faker.lorem.sentence(),
      calificacion: faker.datatype.number({min: 0, max: 5}),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.findReseniaByUsuarioIdReseniaId(usuario.id, newResenia.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "resenia"));
  });

  it('findReseniasByUsuarioId should return resenias by usuario', async ()=>{
    const resenias: ReseniaEntity[] = await service.findReseniasByUsuarioId(usuario.id);
    expect(resenias.length).toBe(5)
  });

  it('findReseniasByUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findReseniasByUsuarioId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateReseniasUsuario should update resenias list for an usuario', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      titulo: faker.lorem.sentence(),
      calificacion: faker.datatype.number({min: 0, max: 5}),
      descripcion: faker.lorem.sentence()
    });
 
    const updatedUsuario: UsuarioEntity = await service.associateReseniasUsuario(usuario.id, [newResenia]);
    expect(updatedUsuario.reseniasRecibidas.length).toBe(1);
    expect(updatedUsuario.reseniasRecibidas[0].titulo).toBe(newResenia.titulo);
    expect(updatedUsuario.reseniasRecibidas[0].calificacion).toBe(newResenia.calificacion);
    expect(updatedUsuario.reseniasRecibidas[0].descripcion).toBe(newResenia.descripcion);
  });

  it('associateReseniasUsuario should throw an exception for an invalid usuario', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      titulo: faker.lorem.sentence(),
      calificacion: faker.datatype.number({min: 0, max: 5}),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.associateReseniasUsuario("0", [newResenia])).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateReseniasUsuario should throw an exception for an invalid resenia', async () => {
    const newResenia: ReseniaEntity = reseniaList[0];
    newResenia.id = "0";
 
    await expect(()=> service.associateReseniasUsuario(usuario.id, [newResenia])).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"));
  });

  it('deleteReseniaToUsuario should remove a resenia from an usuario', async () => {
    const resenia: ReseniaEntity = reseniaList[0];
   
    await service.deleteReseniaUsuario(usuario.id, resenia.id);
 
    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["reseniasRecibidas"]});
    const deletedResenia: ReseniaEntity = storedUsuario.reseniasRecibidas.find(c => c.id === resenia.id);
 
    expect(deletedResenia).toBeUndefined();
  });

  it('deleteReseniaToUsuario should thrown an exception for an invalid resenia', async () => {
    await expect(()=> service.deleteReseniaUsuario(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("resenia"));
  });

  it('deleteReseniaToUsuario should thrown an exception for an invalid usuario', async () => {
    const resenia: ReseniaEntity = reseniaList[0];
    await expect(()=> service.deleteReseniaUsuario("0", resenia.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteReseniaToUsuario should thrown an exception for an non asocciated resenia', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      titulo: faker.lorem.sentence(),
      calificacion: faker.datatype.number({min: 0, max: 5}),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.deleteReseniaUsuario(usuario.id, newResenia.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "resenia"));
  });

});