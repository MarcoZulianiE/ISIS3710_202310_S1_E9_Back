import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EspecialidadEntity } from '../especialidad/especialidad.entity';
import { NotFoundErrorMessage, PreconditionFailedErrorMessage } from '../shared/errors/business-errors';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import { UsuarioEspecialidadService } from './usuario-especialidad.service';

describe('UsuarioEspecialidadService', () => {
  let service: UsuarioEspecialidadService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let especialidadRepository: Repository<EspecialidadEntity>;
  let usuario: UsuarioEntity;
  let especialidadesList: EspecialidadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioEspecialidadService],
    }).compile();

    service = module.get<UsuarioEspecialidadService>(UsuarioEspecialidadService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    especialidadRepository = module.get<Repository<EspecialidadEntity>>(getRepositoryToken(EspecialidadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    especialidadRepository.clear();
    usuarioRepository.clear();
 
    especialidadesList = [];
    for(let i = 0; i < 5; i++){
        const especialidad: EspecialidadEntity = await especialidadRepository.save({
          tipo: faker.helpers.arrayElement(["educativa", "salud", "comportamental"]),
          aniosExperiencia: faker.datatype.number({min: 1000000000, max: 9999999999}),
        })
        especialidadesList.push(especialidad);
    }
    usuario = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
      especialidades: especialidadesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addEspecialidadUsuario should add an especialidad to an usuario', async () => {
    const newEspecialidad: EspecialidadEntity = await especialidadRepository.save({
      tipo: faker.helpers.arrayElement(["educativa", "salud", "comportamental"]),
      aniosExperiencia: faker.datatype.number({min: 1000000000, max: 9999999999})
    });
 
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"])
    })
 
    const result: UsuarioEntity = await service.addEspecialidadUsuario(newUsuario.id, newEspecialidad.id);
   
    expect(result.especialidades.length).toBe(1);
    expect(result.especialidades[0]).not.toBeNull();
    expect(result.especialidades[0].tipo).toBe(newEspecialidad.tipo)
    expect(result.especialidades[0].aniosExperiencia).toBe(newEspecialidad.aniosExperiencia)
  });

  it('addEspecialidadUsuario should thrown exception for an invalid especialidad', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.datatype.number({min: 10000, max: 99999999999}).toString(),
      contrasenia: faker.internet.password(),
      nombre: faker.name.fullName(),
      correoElectronico: faker.internet.email(),
      direccion: faker.address.streetAddress(),
      celular: faker.datatype.number({min: 1000000000, max: 9999999999}).toString(),
      tipoUsuario: faker.helpers.arrayElement(["canguro", "acudiente", "ambos"]),
    })
 
    await expect(() => service.addEspecialidadUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("especialidad"));
  });

  it('findEspecialidadByUsuarioIdEspecialidadId should return especialidad by usuario', async () => {
    const especialidad: EspecialidadEntity = especialidadesList[0];
    const storedEspecialidad: EspecialidadEntity = await service.findEspecialidadByUsuarioIdEspecialidadId(usuario.id, especialidad.id, )
    expect(storedEspecialidad).not.toBeNull();
    expect(storedEspecialidad.tipo).toBe(especialidad.tipo);
    expect(storedEspecialidad.aniosExperiencia).toBe(especialidad.aniosExperiencia);
  });

  it('findEspecialidadByUsuarioIdEspecialidadId should throw an exception for an invalid especialidad', async () => {
    await expect(()=> service.findEspecialidadByUsuarioIdEspecialidadId(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("especialidad"));
  });

  it('findEspecialidadByUsuarioIdEspecialidadId should throw an exception for an invalid usuario', async () => {
    const especialidad: EspecialidadEntity = especialidadesList[0];
    await expect(()=> service.findEspecialidadByUsuarioIdEspecialidadId("0", especialidad.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('findEspecialidadByUsuarioIdEspecialidadId should throw an exception for an especialidad not associated to the usuario', async () => {
    const newEspecialidad: EspecialidadEntity = await especialidadRepository.save({
      tipo: faker.helpers.arrayElement(["educativa", "salud","comportamental"]),
      aniosExperiencia: faker.datatype.number({min: 1000000000, max: 9999999999})
    });

    await expect(()=> service.findEspecialidadByUsuarioIdEspecialidadId(usuario.id, newEspecialidad.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "especialidad"));
  });

  it('findEspecialidadesByUsuarioId should return especialidades by usuario', async ()=>{
    const especialidades: EspecialidadEntity[] = await service.findEspecialidadesByUsuarioId(usuario.id);
    expect(especialidades.length).toBe(5)
  });

  it('findEspecialidadesByUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findEspecialidadesByUsuarioId("0")).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateEspecialidadesUsuario should update especialidades list for an usuario', async () => {
    const newEspecialidad: EspecialidadEntity = await especialidadRepository.save({
      tipo: faker.helpers.arrayElement(["educativa", "salud","comportamental"]),
      aniosExperiencia: faker.datatype.number({min: 1000000000, max: 9999999999})
    });
    const updatedUsuario: UsuarioEntity = await service.associateEspecialidadesUsuario(usuario.id, [newEspecialidad]);
    expect(updatedUsuario.especialidades.length).toBe(1);
    expect(updatedUsuario.especialidades[0].tipo).toBe(newEspecialidad.tipo);
    expect(updatedUsuario.especialidades[0].aniosExperiencia).toBe(newEspecialidad.aniosExperiencia);
  });

  it('associateEspecialidadesUsuario should throw an exception for an invalid usuario', async () => {
    const newEspecialidad: EspecialidadEntity = await especialidadRepository.save({
      tipo: faker.helpers.arrayElement(["educativa", "salud","comportamental"]),
      aniosExperiencia: faker.datatype.number({min: 1000000000, max: 9999999999})
    });
 
    await expect(()=> service.associateEspecialidadesUsuario("0", [newEspecialidad])).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('associateEspecialidadesUsuario should throw an exception for an invalid especialidad', async () => {
    const newEspecialidad: EspecialidadEntity = especialidadesList[0];
    newEspecialidad.id = "0";
 
    await expect(()=> service.associateEspecialidadesUsuario(usuario.id, [newEspecialidad])).rejects.toHaveProperty("message", NotFoundErrorMessage("especialidad"));
  });

  it('deleteEspecialidadUsuario should remove a especialidad from an usuario', async () => {
    const especialidad: EspecialidadEntity = especialidadesList[0];
   
    await service.deleteEspecialidadUsuario(usuario.id, especialidad.id);
 
    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["especialidades"]});
    const deletedEspecialidad: EspecialidadEntity = storedUsuario.especialidades.find(c => c.id === especialidad.id);
 
    expect(deletedEspecialidad).toBeUndefined();
  });

  it('deleteEspecialidadUsuario should thrown an exception for an invalid especialidad', async () => {
    await expect(()=> service.deleteEspecialidadUsuario(usuario.id, "0")).rejects.toHaveProperty("message", NotFoundErrorMessage("especialidad"));
  });

  it('deleteEspecialidadUsuario should thrown an exception for an invalid usuario', async () => {
    const especialidad: EspecialidadEntity = especialidadesList[0];
    await expect(()=> service.deleteEspecialidadUsuario("0", especialidad.id)).rejects.toHaveProperty("message", NotFoundErrorMessage("usuario"));
  });

  it('deleteEspecialidadUsuario should thrown an exception for an non asocciated especialidad', async () => {
    const newEspecialidad: EspecialidadEntity = await especialidadRepository.save({
      tipo: faker.helpers.arrayElement(["educativa", "salud","comportamental"]),
      aniosExperiencia: faker.datatype.number({min: 1000000000, max: 9999999999})
    });
 
    await expect(()=> service.deleteEspecialidadUsuario(usuario.id, newEspecialidad.id)).rejects.toHaveProperty("message", PreconditionFailedErrorMessage("usuario", "especialidad"));
  });

});
