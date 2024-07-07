.PHONY: app-product app-auth app-payment app-notification up down proxy-up proxy-down net

#Step to run microservices
up:
	docker compose up --build 

#Step to stop microservices
down:
	docker compose down

#Step to run build images
app-product:	
	docker build -t alkahfi-store:product -f ./apps/products/Dockerfile .

app-auth:
	docker build -t alkahfi-store:auth ./apps/auth/Dockerfile .	

app-payment:
	docker build -t alkahfi-store:payment ./apps/payments/Dockerfile .

app-orders:
	docker build -t alkahfi-store:order ./apps/orders/Dockerfile .

app-medias:
	docker build -t alkahfi-store:medias ./apps/medias/Dockerfile .

app-notification:
	docker build -t alkahfi-store:notification ./apps/notifications/Dockerfile .








