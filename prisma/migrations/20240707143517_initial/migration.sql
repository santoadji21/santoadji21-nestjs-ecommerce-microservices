-- CreateEnum
CREATE TYPE "UserLevel" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StockHistoryType" AS ENUM ('IN_STOCK', 'OUT_SALES', 'RETUR');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SUCCESS', 'CANCEL');

-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('PENDING', 'SUCCESS', 'CANCEL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'FAILED', 'SUCCESS', 'CANCEL', 'UNPAID', 'PAID', 'REFUND');

-- CreateEnum
CREATE TYPE "PaymenMethod" AS ENUM ('CREDIT', 'BANK', 'EWALLET', 'CASH');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "avatar_media_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "UserLevel" "UserLevel" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "product_name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "product_image" TEXT,
    "product_image_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by_id" UUID NOT NULL,
    "userId" UUID,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockHistory" (
    "id" UUID NOT NULL,
    "stock_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "external_id" TEXT,

    CONSTRAINT "StockHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" UUID NOT NULL,
    "product_id" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" UUID NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status_id" TEXT NOT NULL,
    "OrderStatus" "OrderStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" UUID NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "price_product" DOUBLE PRECISION NOT NULL,
    "qty" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipping" (
    "id" UUID NOT NULL,
    "order_id" TEXT NOT NULL,
    "receive_address" TEXT NOT NULL,
    "receive_email" TEXT NOT NULL,
    "receive_name" TEXT NOT NULL,
    "receive_phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status_id" TEXT NOT NULL,
    "ShippingStatus" "ShippingStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Shipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "payment_image" TEXT,
    "payment_image_media_id" TEXT,
    "PaymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "PaymenMethod" "PaymenMethod" NOT NULL DEFAULT 'BANK',

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_id_idx" ON "User"("email", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_slug_id_idx" ON "Product"("slug", "id");

-- CreateIndex
CREATE INDEX "StockHistory_stock_id_id_idx" ON "StockHistory"("stock_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_product_id_key" ON "Stock"("product_id");

-- CreateIndex
CREATE INDEX "Stock_product_id_id_idx" ON "Stock"("product_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_number_key" ON "Order"("order_number");

-- CreateIndex
CREATE INDEX "Order_order_number_id_user_id_idx" ON "Order"("order_number", "id", "user_id");

-- CreateIndex
CREATE INDEX "OrderItem_order_id_id_idx" ON "OrderItem"("order_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Shipping_order_id_key" ON "Shipping"("order_id");

-- CreateIndex
CREATE INDEX "Shipping_order_id_id_ShippingStatus_idx" ON "Shipping"("order_id", "id", "ShippingStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_order_id_key" ON "Payment"("order_id");

-- CreateIndex
CREATE INDEX "Payment_order_id_id_PaymentStatus_idx" ON "Payment"("order_id", "id", "PaymentStatus");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
