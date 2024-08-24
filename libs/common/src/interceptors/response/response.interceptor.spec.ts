import { TransformInterceptor } from "@app/common/interceptors/response/response.interceptor";

describe("ResponseInterceptor", () => {
	it("should be defined", () => {
		expect(new TransformInterceptor()).toBeDefined();
	});
});
