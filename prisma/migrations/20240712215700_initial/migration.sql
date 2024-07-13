-- CreateEnum
CREATE TYPE "USER_LEVEL" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "STOCK_HISTORY_TYPE" AS ENUM ('INPUT', 'OUT_SALES', 'REJECT');

-- CreateEnum
CREATE TYPE "ORDER_STATUS" AS ENUM ('PENDING', 'ON_PROCESS', 'FAILED', 'CANCEL', 'DONE');

-- CreateEnum
CREATE TYPE "SHIPPING_STATUS" AS ENUM ('PENDING', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('UNPAID', 'FAILED', 'CANCEL', 'PAID');

-- CreateEnum
CREATE TYPE "PAYMENT_METHOD" AS ENUM ('BANK_TRANSFER', 'CASH', 'EWALLET');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "avatar_media_id" TEXT,
    "user_level" "USER_LEVEL" NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "product_image" TEXT,
    "product_image_id" TEXT,
    "created_by_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stock_id" UUID NOT NULL,
    "history_type" "STOCK_HISTORY_TYPE" NOT NULL DEFAULT 'OUT_SALES',
    "notes" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID NOT NULL,

    CONSTRAINT "stock_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "order_no" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL,
    "order_status" "ORDER_STATUS" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "product_price" INTEGER NOT NULL DEFAULT 0,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "receive_address" TEXT,
    "receive_email" TEXT,
    "receive_name" TEXT,
    "receive_phone" TEXT,
    "shipping_status" "SHIPPING_STATUS" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "payment_status" "PAYMENT_STATUS" NOT NULL DEFAULT 'UNPAID',
    "payment_method" "PAYMENT_METHOD" NOT NULL DEFAULT 'BANK_TRANSFER',
    "notes" TEXT,
    "payment_image" TEXT,
    "payment_image_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_id_email_idx" ON "user"("id", "email");

-- CreateIndex
CREATE INDEX "product_id_created_by_id_slug_is_active_idx" ON "product"("id", "created_by_id", "slug", "is_active");

-- CreateIndex
CREATE INDEX "stock_id_product_id_idx" ON "stock"("id", "product_id");

-- CreateIndex
CREATE INDEX "stock_history_id_stock_id_external_id_idx" ON "stock_history"("id", "stock_id", "external_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_order_no_key" ON "order"("order_no");

-- CreateIndex
CREATE INDEX "order_id_user_id_order_no_idx" ON "order"("id", "user_id", "order_no");

-- CreateIndex
CREATE INDEX "order_item_id_order_id_product_id_idx" ON "order_item"("id", "order_id", "product_id");

-- CreateIndex
CREATE INDEX "shipping_id_order_id_idx" ON "shipping"("id", "order_id");

-- CreateIndex
CREATE INDEX "payment_id_order_id_payment_status_idx" ON "payment"("id", "order_id", "payment_status");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
