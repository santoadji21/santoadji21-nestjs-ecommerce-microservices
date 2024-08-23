import { AbstractRepository } from "@app/common/database/mongo/abstract.repository";
import { MediaDocument } from "@app/medias/document/medias.document";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class MediaRepository extends AbstractRepository<MediaDocument> {
	protected readonly logger: Logger = new Logger(MediaDocument.name);

	constructor(
		@InjectModel(MediaDocument.name)
		mediaModel: Model<MediaDocument>,
	) {
		super(mediaModel);
	}
}
