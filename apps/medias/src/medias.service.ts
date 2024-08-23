import { S3Service } from "@app/common/aws/s3/s3.service";
import { MediaDocument } from "@app/medias/document/medias.document";
import { UploadImageDto } from "@app/medias/dto/upload-image.dto";
import { MediaRepository } from "@app/medias/repository/media.repository";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class MediasService {
	constructor(
		private readonly repos: MediaRepository,
		private readonly s3: S3Service,
	) {}
	async create(data: UploadImageDto): Promise<MediaDocument> {
		if (!data) throw new NotFoundException("Media data not found");
		const { image, ...mediaData } = data;
		const mediaDocumentData: Omit<MediaDocument, "_id"> = {
			...mediaData,
			size: data.size ?? 0,
			created_at: new Date(),
			updated_at: new Date(),
		};
		return await this.repos.create(mediaDocumentData);
	}

	async removeMedia(_id: string) {
		const media = await this.repos.findOne({
			_id,
		});

		if (!media) {
			throw new NotFoundException("Media not exists");
		}
		if (media.media_path) await this.s3.removeObject(media.media_path);

		return await this.repos.findOneAndDelete({
			_id,
		});
	}
}
