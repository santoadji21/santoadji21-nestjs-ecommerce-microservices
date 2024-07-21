import { MediaRepository } from '@app/common/repositories/mongo/media.repository';
import { NotificationRepository } from '@app/common/repositories/mongo/notification.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoRepositoriesService {
  constructor(
    private readonly mediaRepos: MediaRepository,
    private readonly notificationRepos: NotificationRepository,
  ) {}

  get mediaRepository() {
    return this.mediaRepos;
  }

  get notificationRepository() {
    return this.notificationRepos;
  }
}
