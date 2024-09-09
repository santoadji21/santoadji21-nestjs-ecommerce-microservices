import { CommonShippingModule } from "@app/shipping/modules/common.shipping.module";
import { ShippingController } from "@app/shipping/shipping.controller";
import { ShippingService } from "@app/shipping/shipping.service";
import { Module } from "@nestjs/common";

@Module({
	imports: [CommonShippingModule],
	controllers: [ShippingController],
	providers: [ShippingService],
})
export class ShippingModule {}
