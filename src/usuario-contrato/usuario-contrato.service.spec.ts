import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ContratoEntity } from '../contrato/contrato.entity';
import { Repository } from 'typeorm';
import { UsuarioContratoService } from './usuario-contrato.service';

import { faker } from '@faker-js/faker';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';

describe('UsuarioContratoService', () => {
  let service: UsuarioContratoService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let contratoRepository: Repository<ContratoEntity>;
  let usuario: UsuarioEntity;
  let contratoList : ContratoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioContratoService],
    }).compile();

    service = module.get<UsuarioContratoService>(UsuarioContratoService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    contratoRepository = module.get<Repository<ContratoEntity>>(getRepositoryToken(ContratoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    contratoRepository.clear();
    usuarioRepository.clear();
 
    contratoList = [];
    for(let i = 0; i < 5; i++){
        const contrato: ContratoEntity = await contratoRepository.save({
          fecha: faker.date.between('2015-01-01', '2020-12-31')
        })
        contratoList.push(contrato);
    }
 
    usuario = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      contratos: contratoList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addContratoUsuario should add a contrato to an usuario', async () => {
    const newContrato: ContratoEntity = await contratoRepository.save({
      fecha: faker.date.between('2015-01-01', '2020-12-31')
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
 
    const result: UsuarioEntity = await service.addContratoUsuario(newUsuario.id, newContrato.id);
   
    expect(result.contratos.length).toBe(1);
    expect(result.contratos[0]).not.toBeNull();
    expect(result.contratos[0].fecha).toEqual(newContrato.fecha)
  });

  it('addContratoUsuario should thrown exception for an invalid contrato', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    await expect(() => service.addContratoUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('addContratoUsuario should thrown exception for an invalid usuario', async () => {
    const newContrato: ContratoEntity = await contratoRepository.save({
      fecha: faker.date.between('2015-01-01', '2020-12-31')
    });
 
    await expect(() => service.addContratoUsuario("0", newContrato.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('findContratoByUsuarioIdContratoId should return contrato by usuario', async () => {
    const contrato: ContratoEntity = contratoList[0];
    const storedContrato: ContratoEntity = await service.findContratoByUsuarioIdContratoId(usuario.id, contrato.id)
    expect(storedContrato).not.toBeNull();
    expect(storedContrato.fecha).toEqual(contrato.fecha)
  });

  it('findContratoByUsuarioIdContratoId should throw an exception for an invalid contrato', async () => {
    await expect(()=> service.findContratoByUsuarioIdContratoId(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('findContratoByUsuarioIdContratoId should throw an exception for an invalid usuario', async () => {
    const contrato: ContratoEntity = contratoList[0];
    await expect(()=> service.findContratoByUsuarioIdContratoId("0", contrato.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('findContratoByUsuarioIdContratoId should throw an exception for an contrato not associated to the usuario', async () => {
    const newContrato: ContratoEntity = await contratoRepository.save({
      fecha: faker.date.between('2015-01-01', '2020-12-31')
    });
 
    await expect(()=> service.findContratoByUsuarioIdContratoId(usuario.id, newContrato.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "contrato"));
  });

  it('findContratosByUsuarioId should return contratos by usuario', async ()=>{
    const contratos: ContratoEntity[] = await service.findContratosByUsuarioId(usuario.id);
    expect(contratos.length).toBe(5)
  });

  it('findContratosByUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findContratosByUsuarioId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateContratosUsuario should update contratos list for an usuario', async () => {
    const newContrato: ContratoEntity = await contratoRepository.save({
      fecha: faker.date.between('2015-01-01', '2020-12-31')
    });
 
    const updatedUsuario: UsuarioEntity = await service.associateContratosUsuario(usuario.id, [newContrato]);
    expect(updatedUsuario.contratos.length).toBe(1);
    expect(updatedUsuario.contratos[0].fecha).toBe(newContrato.fecha);
  });

  it('associateContratosUsuario should throw an exception for an invalid usuario', async () => {
    const newContrato: ContratoEntity = await contratoRepository.save({
      fecha: faker.date.between('2015-01-01', '2020-12-31')
    });
 
    await expect(()=> service.associateContratosUsuario("0", [newContrato])).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateContratosUsuario should throw an exception for an invalid contrato', async () => {
    const newContrato: ContratoEntity = contratoList[0];
    newContrato.id = "0";
 
    await expect(()=> service.associateContratosUsuario(usuario.id, [newContrato])).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('deleteContratoToUsuario should remove a contrato from an usuario', async () => {
    const contrato: ContratoEntity = contratoList[0];
   
    await service.deleteContratoUsuario(usuario.id, contrato.id);
 
    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["contratos"]});
    const deletedContrato: ContratoEntity = storedUsuario.contratos.find(c => c.id === contrato.id);
 
    expect(deletedContrato).toBeUndefined();
  });

  it('deleteContratoToUsuario should thrown an exception for an invalid contrato', async () => {
    await expect(()=> service.deleteContratoUsuario(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("contrato"));
  });

  it('deleteContratoToUsuario should thrown an exception for an invalid usuario', async () => {
    const contrato: ContratoEntity = contratoList[0];
    await expect(()=> service.deleteContratoUsuario("0", contrato.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteContratoToUsuario should thrown an exception for an non asocciated contrato', async () => {
    const newContrato: ContratoEntity = await contratoRepository.save({
      fecha: faker.date.between('2015-01-01', '2020-12-31')
    });
 
    await expect(()=> service.deleteContratoUsuario(usuario.id, newContrato.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "contrato"));
  });

});