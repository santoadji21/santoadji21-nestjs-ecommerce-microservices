import { createReadStream, existsSync, rmdirSync, unlinkSync } from "node:fs";
import { Readable } from "node:stream";
import { S3Service } from "@app/common/aws/s3/s3.service";
import { UploadImageDto } from "@app/medias/dto/upload-image.dto";
import { MediasService } from "@app/medias/medias.service";
import {
	Body,
	Controller,
	Delete,
	InternalServerErrorException,
	Param,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Controller()
export class MediasController {
	constructor(
		private readonly mediasService: MediasService,
		private readonly s3: S3Service,
		@InjectPinoLogger() private readonly logger: PinoLogger,
	) {}

	@UseInterceptors(
		FileInterceptor("image", {
			storage: diskStorage({
				destination: "./uploads",
				filename: (_req, file, cb) => {
					try {
						const filename = `${new Date().getTime()}-${file.originalname}`;
						cb(null, filename);
					} catch (err) {
						console.log(err);
						cb(err, "");
					}
				},
			}),
		}),
	)
	@Post("upload")
	async upload(
		@UploadedFile() file: Express.Multer.File,
		@Body() data: UploadImageDto,
	) {
		if (file) {
			const fileLocal = await this.streamToBuffer(createReadStream(file.path));

			const name = file.path;
			const upload = await this.s3.upload(fileLocal, name);
			data.media_name = file.originalname;
			data.media_path = file.path;
			data.url = this.s3.publicUrl(file.path);
			data.media_type = file.mimetype;
			data.size = file.size;

			if (upload) {
				if (existsSync(file.path)) {
					this.logger.info("Remove local temporary upload image ", file.path);
					unlinkSync(file.path);
				}
			}

			this.logger.info("Upload image success ", upload);
			rmdirSync("./uploads", { recursive: true });
			this.logger.info("Remove local temporary upload image ", "./uploads");
			return {
				data: await this.mediasService.create(data),
				message: "Upload Image Success",
			};
		}
		throw new InternalServerErrorException("Upload image error");
	}

	@ApiParam({ name: "id" })
	@ApiOperation({ summary: "Remove media by id" })
	@Delete("remove/:id")
	async remove(@Param("id") id) {
		await this.mediasService.removeMedia(id);
		this.logger.info("Remove media success ", id);
		return {
			data: {},
			message: "Remove media success",
		};
	}

	private async streamToBuffer(stream: Readable): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const chunks: Buffer[] = [];
			stream.on("data", (chunk) =>
				chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)),
			);
			stream.on("end", () => resolve(Buffer.concat(chunks)));
			stream.on("error", reject);
		});
	}
}
