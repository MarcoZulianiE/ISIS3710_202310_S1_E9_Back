/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AntecedenteEntity } from './antecedente.entity';
import { AntecedenteService } from './antecedente.service';

describe('AntecedenteService', () => {
  let service: AntecedenteService;
  let repository: Repository<AntecedenteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AntecedenteService],
    }).compile();

    service = module.get<AntecedenteService>(AntecedenteService);
    repository = module.get<Repository<AntecedenteEntity>>(getRepositoryToken(AntecedenteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
