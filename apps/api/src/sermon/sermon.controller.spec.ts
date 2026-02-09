import { Test, TestingModule } from '@nestjs/testing';
import { SermonController } from './sermon.controller';

describe('SermonController', () => {
  let controller: SermonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SermonController],
    }).compile();

    controller = module.get<SermonController>(SermonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
