import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import {
	ModelDefinition,
	MongooseModule,
	MongooseModuleOptions,
} from "@nestjs/mongoose";

@Module({})
export class DbMongooseModule {
	static registerAsync<T>(
		imports: ModuleMetadata["imports"] = [],
		injectServices: Provider[] = [],
		useFactory: (...args: T[]) => {
			uri: string;
			options?: Partial<MongooseModuleOptions>;
		},
	): DynamicModule {
		return {
			module: DbMongooseModule,
			imports: [
				...imports,
				MongooseModule.forRootAsync({
					imports: imports,
					inject: injectServices,
					useFactory: async (...args: T[]) => {
						const { uri, options } = useFactory(...args);
						return {
							uri,
							...options,
						};
					},
				}),
			],
			exports: [MongooseModule],
		};
	}

	static forFeature(models: ModelDefinition[]): DynamicModule {
		return {
			module: DbMongooseModule,
			imports: [MongooseModule.forFeature(models)],
			exports: [MongooseModule.forFeature(models)],
		};
	}
}
