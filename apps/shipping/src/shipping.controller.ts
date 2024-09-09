import { JwtAuthGuard } from "@app/common/auth/jwt-auth.guard";
import { RoleGuard } from "@app/common/auth/role-auth.guard";
import { Roles } from "@app/common/decorators";
import { UpdateShippingDto } from "@app/shipping/dto/shipping.dto";
import { ShippingService } from "@app/shipping/shipping.service";
import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Put,
	UseGuards,
} from "@nestjs/common";
import { USER_LEVEL } from "@prisma/client";

@Controller()
export class ShippingController {
	constructor(private readonly shippingService: ShippingService) {}

	@Put("/:shipping_id")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	async updateStatus(
		@Param("shipping_id") shipping_id,
		@Body() data: UpdateShippingDto,
	) {
		const updateShippingStatus = await this.shippingService.updateStatus(
			shipping_id,
			data,
		);
		return {
			data: updateShippingStatus,
			message: "Update shipping status success",
		};
	}
}
