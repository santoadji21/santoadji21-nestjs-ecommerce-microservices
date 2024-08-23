import {
	S3ModuleOptions,
	S3_MODULE_OPTIONS_TOKEN,
} from "@app/common/aws/s3/config/s3-module-definition";
import {
	ObjectCannedACL,
	PutObjectCommandInput,
	PutObjectCommandOutput,
	S3,
} from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Injectable()
export class S3Service {
	private s3: S3;

	constructor(
		@Inject(S3_MODULE_OPTIONS_TOKEN) private options: S3ModuleOptions,
		@InjectPinoLogger() private readonly logger: PinoLogger,
	) {
		// Initialize AWS S3 client
		this.s3 = new S3({
			region: this.options.region,
			credentials: {
				accessKeyId: this.options.aws_access_key_id,
				secretAccessKey: this.options.aws_secret_access_key,
			},
			endpoint: this.options.endpoint,
			forcePathStyle: this.options.forcePathStyle,
		});
	}

	async upload(
		file: Buffer | Uint8Array | Blob | string | ReadableStream,
		name: string,
	) {
		return await this.uploadS3(file, this.options.bucket, name, "public-read");
	}

	publicUrl(path: string): string {
		return `${this.options.url}/${this.options.bucket}/${path}`;
	}

	async uploadS3(
		file: Buffer | Uint8Array | Blob | string | ReadableStream,
		bucket: string,
		name: string,
		acl?: ObjectCannedACL,
	): Promise<PutObjectCommandOutput> {
		let contentType: string;
		if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
			contentType = "image/jpeg";
		} else if (name.endsWith(".png")) {
			contentType = "image/png";
		} else {
			contentType = "application/octet-stream";
		}
		const params: PutObjectCommandInput = {
			Bucket: bucket,
			Key: name,
			Body: file,
			ACL: acl,
			ContentType: contentType,
		};
		try {
			const result = await this.s3.putObject(params);
			this.logger.debug("Upload to s3 success");
			return result;
		} catch (err) {
			this.logger.error("Upload to s3 error", err);
			throw new Error(err.message);
		}
	}

	async removeObject(keyName: string): Promise<boolean> {
		try {
			await this.s3.deleteObject({
				Key: keyName,
				Bucket: this.options.bucket,
			});
			this.logger.debug("Remove object success", keyName);
			return true;
		} catch (err) {
			this.logger.error("Remove object error", err);
			return false;
		}
	}
}
