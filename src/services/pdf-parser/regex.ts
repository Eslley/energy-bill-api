export const regexPatterns = {
  clientNumber: /Nº DO CLIENTE\s+Nº DA INSTALAÇÃO\s+(\d*)/,
  clientName: /(?<=\d{11}-\d\s\d{11}-\d\s\d{11}-\d\s\d{11}-\d)\s([A-ZÀ-ÿ\s]+)/,
  installationNumber: /Nº DA INSTALAÇÃO\s+\d*\s+(\d*)/,
  referencedDate:
    /Referente a\s+Vencimento\s+Valor a pagar\s+\(R\$\)\s+(\w*)\/(\d*)/, // 1 - Mês (JAN) 2 - Ano (2025)
  dueDate:
    /Referente a\s+Vencimento\s+Valor a pagar\s+\(R\$\)\s+\w*\/\d*\s*(\d{2}\/\d{2}\/\d{4})/,
  totalValue:
    /Referente a\s+Vencimento\s+Valor a pagar\s+\(R\$\)\s+\w*\/\d*\s*\d{2}\/\d{2}\/\d{4}\s*(\d*,\d*)/,
  emissionDate: /Data de emissão: (\d{2}\/\d{2}\/\d{4})/,
  receiptNumber: /NOTA FISCAL Nº\s*(\d*)/,
  eletricalEnergy:
    /Energia Elétrica\w*\s*(\d{1,3}(?:\.\d{3})*(?:\,\d+)?)\s*(\d{1,3}(?:\.\d{3})*(?:\,\d+)?)\s*(\d{1,3}(?:\.\d{3})*(?:\,\d+)?)/, // 1 - Quant. 2 - Preço Unit. 3 - Valor (R$)
  SCEEEnergy:
    /Energia SCEE s\/ ICMS\w*\s*(\d{1,3}(?:\.\d{3})*(?:\,\d+)?)\s*(\d{1,3}(?:\.\d{3})*(?:\,\d+)?)\s*(\d{1,3}(?:\.\d{3})*(?:\,\d+)?)/, // 1 - Quant. 2 - Preço Unit. 3 - Valor (R$)
  GDIEnergy:
    /Energia compensada GD I\w*\s*(\d{1,3}(?:\.\d{3})*(?:\,\d+)?)\s*(\d{1,3}(?:\.\d{3})*(?:\,\d+)?)\s*(-\d{1,3}(?:\.\d{3})*(?:\,\d+)?)/, // 1 - Quant. 2 - Preço Unit. 3 - Valor (R$)
  publicLightingContribution: /Contrib Ilum Publica Municipal\s*(\d*,\d*)/,
  damageCompensation:
    /Ressarcimento de Danos\s*(-\d{1,3}(?:\.\d{3})*(?:\,\d+)?)/,
  billBarCode: /((\d{11}-\d\s){3}\d{11}-\d)/,
  address: /\n([A-Z0-9\s]+)\s(\d{5}-\d{3})\s([A-Z ]+),\s([A-Z]+)/,
};
