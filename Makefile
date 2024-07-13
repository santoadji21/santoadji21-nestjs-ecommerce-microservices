.PHONY: app-product app-auth app-payment app-notification up down proxy-up proxy-down net init plan apply destroy set-cluster rm-volume

#Step to run microservices
up:
	docker compose up --build 

#Step to stop microservices
down:
	docker compose down

rm-volume:
	docker volume ls | grep -E '^local\s+nestjs-ecommerce.*$' | awk '{print $2}' | xargs docker volume rm

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


#Make EKS Aws Cluster
init:
	terraform -chdir='./terraform' init 

plan:
	terraform -chdir='./terraform' plan

apply:
	terraform -chdir='./terraform' apply -auto-approve

destroy:
	terraform -chdir='./terraform' destroy -auto-approve

set-cluster:
	aws eks --region $(terraform -chdir='./terraform' output -raw region) update-kubeconfig --name $(terraform -chdir='./terraform' output -raw cluster_name)






