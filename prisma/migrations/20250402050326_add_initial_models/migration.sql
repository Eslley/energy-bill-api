-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installation" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "energy_bill" (
    "id" UUID NOT NULL,
    "clientId" TEXT NOT NULL,
    "installationId" TEXT NOT NULL,
    "referenceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "emissionDate" TIMESTAMP(3) NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "totalValue" DECIMAL(15,2) NOT NULL,
    "eletricalEnergyQuantity" INTEGER NOT NULL,
    "eletricalEnergyUnitValue" DECIMAL(10,6) NOT NULL,
    "eletricalEnergyTotalValue" DECIMAL(15,2) NOT NULL,
    "GDIEnergyQuantity" INTEGER NOT NULL,
    "GDIEnergyUnitValue" DECIMAL(10,6) NOT NULL,
    "GDIEnergyTotalValue" DECIMAL(15,2) NOT NULL,
    "SCEEEnergyQuantity" INTEGER NOT NULL,
    "SCEEEnergyUnitValue" DECIMAL(10,6) NOT NULL,
    "SCEEEnergyTotalValue" DECIMAL(15,2) NOT NULL,
    "publicLightingContribution" DECIMAL(15,2) NOT NULL,
    "damageCompensation" DECIMAL(15,2),
    "billBarCode" TEXT NOT NULL,
    "raw" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "energy_bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "installation" ADD CONSTRAINT "installation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_bill" ADD CONSTRAINT "energy_bill_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_bill" ADD CONSTRAINT "energy_bill_installationId_fkey" FOREIGN KEY ("installationId") REFERENCES "installation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
