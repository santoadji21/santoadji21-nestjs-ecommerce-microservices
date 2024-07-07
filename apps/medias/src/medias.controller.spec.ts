import { Test, TestingModule } from '@nestjs/testing';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';

describe('MediasController', () => {
  let mediasController: MediasController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MediasController],
      providers: [MediasService],
    }).compile();

    mediasController = app.get<MediasController>(MediasController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mediasController.getHello()).toBe('Hello World!');
    });
  });
});
