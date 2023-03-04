/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { AntecedenteEntity } from '../antecedente/antecedente.entity';
import { Repository } from 'typeorm';
import { UsuarioAntecedenteService } from './usuario-antecedente.service';

import { faker } from '@faker-js/faker';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

describe('UsuarioAntecedenteService', () => {
  let service: UsuarioAntecedenteService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let antecedenteRepository: Repository<AntecedenteEntity>;
  let usuario: UsuarioEntity;
  let antecedenteList : AntecedenteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioAntecedenteService],
    }).compile();

    service = module.get<UsuarioAntecedenteService>(UsuarioAntecedenteService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    antecedenteRepository = module.get<Repository<AntecedenteEntity>>(getRepositoryToken(AntecedenteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    antecedenteRepository.clear();
    usuarioRepository.clear();
 
    antecedenteList = [];
    for(let i = 0; i < 5; i++){
        const antecedente: AntecedenteEntity = await antecedenteRepository.save({
          tipo: faker.helpers.arrayElement(["judiciales", "disciplinarios","fiscales"]),
          descripcion: faker.lorem.sentence()
        })
        antecedenteList.push(antecedente);
    }
 
    usuario = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      antecedentes: antecedenteList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAntecedenteUsuario should add a antecedente to an usuario', async () => {
    const newAntecedente: AntecedenteEntity = await antecedenteRepository.save({
      tipo: faker.helpers.arrayElement(["judiciales", "disciplinarios","fiscales"]),
      descripcion: faker.lorem.sentence()
    });
 
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    const result: UsuarioEntity = await service.addAntecedenteUsuario(newUsuario.id, newAntecedente.id);
   
    expect(result.antecedentes.length).toBe(1);
    expect(result.antecedentes[0]).not.toBeNull();
    expect(result.antecedentes[0].tipo).toEqual(newAntecedente.tipo);
    expect(result.antecedentes[0].descripcion).toEqual(newAntecedente.descripcion);
  });

  it('addAntecedenteUsuario should thrown exception for an invalid antecedente', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    await expect(() => service.addAntecedenteUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("antecedente"));
  });

  it('addAntecedenteUsuario should thrown exception for an invalid usuario', async () => {
    const newAntecedente: AntecedenteEntity = await antecedenteRepository.save({
      tipo: faker.helpers.arrayElement(["judiciales", "disciplinarios","fiscales"]),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(() => service.addAntecedenteUsuario("0", newAntecedente.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('findAntecedenteByUsuarioIdAntecedenteId should return antecedente by usuario', async () => {
    const antecedente: AntecedenteEntity = antecedenteList[0];
    const storedAntecedente: AntecedenteEntity = await service.findAntecedenteByUsuarioIdAntecedenteId(usuario.id, antecedente.id)
    expect(storedAntecedente).not.toBeNull();
    expect(storedAntecedente.tipo).toEqual(antecedente.tipo);
    expect(storedAntecedente.descripcion).toEqual(antecedente.descripcion);
  });

  it('findAntecedenteByUsuarioIdAntecedenteId should throw an exception for an invalid antecedente', async () => {
    await expect(()=> service.findAntecedenteByUsuarioIdAntecedenteId(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("antecedente"));
  });

  it('findAntecedenteByUsuarioIdAntecedenteId should throw an exception for an invalid usuario', async () => {
    const antecedente: AntecedenteEntity = antecedenteList[0];
    await expect(()=> service.findAntecedenteByUsuarioIdAntecedenteId("0", antecedente.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('findAntecedenteByUsuarioIdAntecedenteId should throw an exception for an antecedente not associated to the usuario', async () => {
    const newAntecedente: AntecedenteEntity = await antecedenteRepository.save({
      tipo: faker.helpers.arrayElement(["judiciales", "disciplinarios","fiscales"]),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.findAntecedenteByUsuarioIdAntecedenteId(usuario.id, newAntecedente.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "antecedente"));
  });

  it('findAntecedentesByUsuarioId should return antecedentes by usuario', async ()=>{
    const antecedentes: AntecedenteEntity[] = await service.findAntecedentesByUsuarioId(usuario.id);
    expect(antecedentes.length).toBe(5)
  });

  it('findAntecedentesByUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findAntecedentesByUsuarioId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateAntecedentesUsuario should update antecedentes list for an usuario', async () => {
    const newAntecedente: AntecedenteEntity = await antecedenteRepository.save({
      tipo: faker.helpers.arrayElement(["judiciales", "disciplinarios","fiscales"]),
      descripcion: faker.lorem.sentence()
    });
 
    const updatedUsuario: UsuarioEntity = await service.associateAntecedentesUsuario(usuario.id, [newAntecedente]);
    expect(updatedUsuario.antecedentes.length).toBe(1);
    expect(updatedUsuario.antecedentes[0].tipo).toBe(newAntecedente.tipo);
    expect(updatedUsuario.antecedentes[0].descripcion).toBe(newAntecedente.descripcion);
  });

  it('associateAntecedentesUsuario should throw an exception for an invalid usuario', async () => {
    const newAntecedente: AntecedenteEntity = await antecedenteRepository.save({
      tipo: faker.helpers.arrayElement(["judiciales", "disciplinarios","fiscales"]),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.associateAntecedentesUsuario("0", [newAntecedente])).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateAntecedentesUsuario should throw an exception for an invalid antecedente', async () => {
    const newAntecedente: AntecedenteEntity = antecedenteList[0];
    newAntecedente.id = "0";
 
    await expect(()=> service.associateAntecedentesUsuario(usuario.id, [newAntecedente])).rejects.toHaveProperty("message", NotFoundErrorMessage("antecedente"));
  });

  it('deleteAntecedenteToUsuario should remove a antecedente from an usuario', async () => {
    const antecedente: AntecedenteEntity = antecedenteList[0];
   
    await service.deleteAntecedenteUsuario(usuario.id, antecedente.id);
 
    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["antecedentes"]});
    const deletedAntecedente: AntecedenteEntity = storedUsuario.antecedentes.find(c => c.id === antecedente.id);
 
    expect(deletedAntecedente).toBeUndefined();
  });

  it('deleteAntecedenteToUsuario should thrown an exception for an invalid antecedente', async () => {
    await expect(()=> service.deleteAntecedenteUsuario(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("antecedente"));
  });

  it('deleteAntecedenteToUsuario should thrown an exception for an invalid usuario', async () => {
    const antecedente: AntecedenteEntity = antecedenteList[0];
    await expect(()=> service.deleteAntecedenteUsuario("0", antecedente.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteAntecedenteToUsuario should thrown an exception for an non asocciated antecedente', async () => {
    const newAntecedente: AntecedenteEntity = await antecedenteRepository.save({
      tipo: faker.helpers.arrayElement(["judiciales", "disciplinarios","fiscales"]),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.deleteAntecedenteUsuario(usuario.id, newAntecedente.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "antecedente"));
  });

});
