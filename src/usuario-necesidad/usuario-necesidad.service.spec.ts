import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NecesidadEntity } from '../necesidad/necesidad.entity';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioNecesidadService } from './usuario-necesidad.service';

describe('UsuarioNecesidadService', () => {
  let service: UsuarioNecesidadService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let necesidadRepository: Repository<NecesidadEntity>;
  let usuario: UsuarioEntity;
  let necesidadesList: NecesidadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioNecesidadService],
    }).compile();

    service = module.get<UsuarioNecesidadService>(UsuarioNecesidadService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    necesidadRepository = module.get<Repository<NecesidadEntity>>(getRepositoryToken(NecesidadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    necesidadRepository.clear();
    usuarioRepository.clear();
 
    necesidadesList = [];
    for(let i = 0; i < 5; i++){
        const necesidad: NecesidadEntity = await necesidadRepository.save({
          tipo: faker.helpers.arrayElement(["educativa", "salud", "comportamental"]),
          descripcion: faker.lorem.sentence(),
        })
        necesidadesList.push(necesidad);
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
      necesidades: necesidadesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addNecesidadUsuario should add an necesidad to an usuario', async () => {
    const newNecesidad: NecesidadEntity = await necesidadRepository.save({
      tipo: faker.helpers.arrayElement(["educativa", "salud", "comportamental"]),
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
      aniosExperiencia: faker.datatype.number({min: 0, max: 100})
    })
 
    const result: UsuarioEntity = await service.addNecesidadUsuario(newUsuario.id, newNecesidad.id);
   
    expect(result.necesidades.length).toBe(1);
    expect(result.necesidades[0]).not.toBeNull();
    expect(result.necesidades[0].tipo).toBe(newNecesidad.tipo)
    expect(result.necesidades[0].descripcion).toBe(newNecesidad.descripcion)
  });

  it('addNecesidadUsuario should thrown exception for an invalid necesidad', async () => {
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
 
    await expect(() => service.addNecesidadUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("necesidad"));
  });

  it('findNecesidadByUsuarioIdNecesidadId should return necesidad by usuario', async () => {
    const necesidad: NecesidadEntity = necesidadesList[0];
    const storedNecesidad: NecesidadEntity = await service.findNecesidadByUsuarioIdNecesidadId(usuario.id, necesidad.id, )
    expect(storedNecesidad).not.toBeNull();
    expect(storedNecesidad.tipo).toBe(necesidad.tipo);
    expect(storedNecesidad.descripcion).toBe(necesidad.descripcion);
  });

  it('findNecesidadByUsuarioIdNecesidadId should throw an exception for an invalid necesidad', async () => {
    await expect(()=> service.findNecesidadByUsuarioIdNecesidadId(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("necesidad"));
  });

  it('findNecesidadByUsuarioIdNecesidadId should throw an exception for an invalid usuario', async () => {
    const necesidad: NecesidadEntity = necesidadesList[0];
    await expect(()=> service.findNecesidadByUsuarioIdNecesidadId("0", necesidad.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('findNecesidadByUsuarioIdNecesidadId should throw an exception for an necesidad not associated to the usuario', async () => {
    const newNecesidad: NecesidadEntity = await necesidadRepository.save({
      tipo: faker.helpers.arrayElement(["educativa", "salud","comportamental"]),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.findNecesidadByUsuarioIdNecesidadId(usuario.id, newNecesidad.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "necesidad"));
  });

  it('findNecesidadesByUsuarioId should return necesidades by usuario', async ()=>{
    const necesidades: NecesidadEntity[] = await service.findNecesidadesByUsuarioId(usuario.id);
    expect(necesidades.length).toBe(5)
  });

  it('findNecesidadesByUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findNecesidadesByUsuarioId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateNecesidadesUsuario should update necesidades list for an usuario', async () => {
    const newNecesidad: NecesidadEntity = await necesidadRepository.save({
      tipo: faker.helpers.arrayElement(["educativa", "salud","comportamental"]),
      descripcion: faker.lorem.sentence()
    });
    const updatedUsuario: UsuarioEntity = await service.associateNecesidadesUsuario(usuario.id, [newNecesidad]);
    expect(updatedUsuario.necesidades.length).toBe(1);
    expect(updatedUsuario.necesidades[0].tipo).toBe(newNecesidad.tipo);
    expect(updatedUsuario.necesidades[0].descripcion).toBe(newNecesidad.descripcion);
  });

  it('associateNecesidadesUsuario should throw an exception for an invalid usuario', async () => {
    const newNecesidad: NecesidadEntity = await necesidadRepository.save({
      tipo: faker.helpers.arrayElement(["educativa", "salud","comportamental"]),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.associateNecesidadesUsuario("0", [newNecesidad])).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateNecesidadesUsuario should throw an exception for an invalid necesidad', async () => {
    const newNecesidad: NecesidadEntity = necesidadesList[0];
    newNecesidad.id = "0";
 
    await expect(()=> service.associateNecesidadesUsuario(usuario.id, [newNecesidad])).rejects.toHaveProperty("message", NotFoundErrorMessage("necesidad"));
  });

  it('deleteNecesidadUsuario should remove a necesidad from an usuario', async () => {
    const necesidad: NecesidadEntity = necesidadesList[0];
   
    await service.deleteNecesidadUsuario(usuario.id, necesidad.id);
 
    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["necesidades"]});
    const deletedNecesidad: NecesidadEntity = storedUsuario.necesidades.find(c => c.id === necesidad.id);
 
    expect(deletedNecesidad).toBeUndefined();
  });

  it('deleteNecesidadUsuario should thrown an exception for an invalid necesidad', async () => {
    await expect(()=> service.deleteNecesidadUsuario(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("necesidad"));
  });

  it('deleteNecesidadUsuario should thrown an exception for an invalid usuario', async () => {
    const necesidad: NecesidadEntity = necesidadesList[0];
    await expect(()=> service.deleteNecesidadUsuario("0", necesidad.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteNecesidadUsuario should thrown an exception for an non asocciated necesidad', async () => {
    const newNecesidad: NecesidadEntity = await necesidadRepository.save({
      tipo: faker.helpers.arrayElement(["educativa", "salud","comportamental"]),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.deleteNecesidadUsuario(usuario.id, newNecesidad.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "necesidad"));
  });

});
