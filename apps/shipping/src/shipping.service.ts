import { EVENTS } from "@app/common/constants/events/events";
import { SERVICES } from "@app/common/constants/services/services";
import { PostgresRepositoriesService } from "@app/common/repositories/postgres/postgres.repositories.service";
import { ShippingDataNotification } from "@app/common/schemas/shipping.schema";
import { UpdateShippingDto } from "@app/shipping/dto/shipping.dto";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class ShippingService {
	constructor(
		private readonly repos: PostgresRepositoriesService,
		@Inject(SERVICES.NOTIFICATION) private client: ClientProxy,
	) {}

	async updateStatus(id: string, data: UpdateShippingDto) {
		const shipping = await this.repos.shippingRepository.findById(id);
		if (!shipping) {
			throw new NotFoundException("Shipping not found");
		}
		const update = await this.repos.shippingRepository.update(id, data);
		const payload: ShippingDataNotification = {
			shipping_id: update.id,
		};
		this.client.emit(EVENTS.EMAIL.SHIPPING_STATUS, payload);
		return update;
	}
}
