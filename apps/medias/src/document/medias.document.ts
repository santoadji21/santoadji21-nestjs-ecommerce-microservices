import { AbstractDocument } from "@app/common/database/mongo/abstract.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class MediaDocument extends AbstractDocument {
	@Prop()
	media_name?: string;

	@Prop()
	description?: string;

	@Prop()
	media_path?: string;

	@Prop()
	url?: string;

	@Prop()
	media_type?: string;

	@Prop({ default: 0 })
	size: number;

	@Prop({ default: Date.now })
	created_at: Date;

	@Prop({ default: Date.now, updatedAt: true })
	updated_at: Date;
}

export const MediaSchema = SchemaFactory.createForClass(MediaDocument);
