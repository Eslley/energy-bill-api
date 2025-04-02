import pdfParse from 'pdf-parse';
import { Either } from '@core/either';
import { EnergyBillParserService } from '@services/pdf-parser/energy-bill-parser-implementation';
import { EnergyBillParserError } from '@services/pdf-parser/errors';

jest.mock('pdf-parse', () => jest.fn());

describe('EnergyBillParserService', () => {
  let service: EnergyBillParserService;
  const mockPdfText = `
        Valores Faturados
        Itens da FaturaUnid.Quant.Preço UnitValor (R$) PIS/COFINSBase Calc.Aliq.ICMSTarifa Unit.
        ICMSICMS
        Energia ElétricakWh     100  0,95543124        95,52 0,74906000
        Energia SCEE s/ ICMSkWh   2.300  0,50970610     1.172,31 0,48733000
        Energia compensada GD IkWh   2.300  0,48733000    -1.120,85 0,48733000
        Contrib Ilum Publica Municipal         40,45
        Ressarcimento de Danos       -120,81
        TOTAL         66,62
        Histórico de Consumo
        MÊS/ANOCons. kWhMédia kWh/DiaDias
        JAN/24   2.400     72,72   33
        DEZ/23   2.280     81,42   28
        NOV/23   2.360     78,66   30
        OUT/23   2.880     87,27   33
        SET/23   1.520     52,41   29
        AGO/23   1.520     46,06   33
        JUL/23     320     21,33   15
        JUN/23       0      0,00    0
        MAI/23       0      0,00    0
        ABR/23       0      0,00    0
        MAR/23       0      0,00    0
        FEV/23       0      0,00    0
        JAN/23       0      0,00    0
        Reservado ao Fisco
        SEM VALOR FISCAL
        Base de cálculo (R$)Alíquota (%)Valor (R$)
        Fale com CEMIG: 116 - CEMIG Torpedo 29810 - Ouvidoria CEMIG: 0800 728 3838 - Agência Nacional de Energia Elétrica - ANEEL - Telefone: 167 - 
        Ligação gratuita de telefones fixos e móveis.
        Código de Débito AutomáticoInstalaçãoVencimentoTotal a pagar
        008128696724300142276209/02/2024R$66,62
        Janeiro/202483670000000-0 66620138002-7 91607372233-9 08128696724-5
        ATENÇÃO:
        DÉBITO AUTOMÁTICO
        SELFWAY TREINAMENTO PERSONALIZADO LTDA
        AV BANDEIRANTES 1586 CS
        COMITECO
        30315-032 BELO HORIZONTE, MG
        CNPJ 31.176.0**/****-**
                Nº DO CLIENTE                      Nº DA INSTALAÇÃO
        7202210726        3001422762
                Referente a                                Vencimento                       Valor a pagar (R$)
            JAN/2024               09/02/2024               66,62
        NOTA FISCAL Nº 113443542 - SÉRIE 000
        Data de emissão: 23/01/2024
        Consulte pela chave de acesso em:
        http://www.sped.fazenda.mg.gov.br/spedmg/nf3e
        chave de acesso:
        31240106981180000116660001134435421093514577
        Protocolo de autorização: 1312400124189531
        24.01.2024 às 02:16:37
        ClasseSubclasseModalidade TarifáriaDatas de Leitura
        Comercial Outros serviços Convencional B3AnteriorAtualNº de diasPróxima
        Trifásico e outras atividades20/1222/01 3319/02
        Informações Técnicas
        Tipo de MediçãoMediçãoLeituraLeituraConstanteConsumo kWh
        AnteriorAtualde Multiplicação
        Energia kWhBPC228203359378438402.400

        DOCUMENTO AUXILIAR DA NOTA FISCAL DE ENERGIA ELÉTRICA ELETRÔNICASEGUNDA VIA
        CEMIG DISTRIBUIÇÃO S.A. CNPJ 06.981.180/0001-16 / INSC. ESTADUAL 062.322136.0087.
        AV. BARBACENA, 1200 - 17° ANDAR - ALA 1 - BAIRRO SANTO AGOSTINHO
        CEP: 30190-131 - BELO HORIZONTE - MG.TARIFA SOCIAL DE ENERGIA ELÉTRICA - TSEE FOI CRIADA PELA LEI Nº 10.438, DE 26 DE ABRIL DE 2002
        Informações Gerais
        SALDO ATUAL DE GERAÇÃO: 1.212,00 kWh. Tarifa vigente conforme Res Aneel nº 3.202, de 23/05/2023.
        Redução aliquota ICMS conforme Lei Complementar 194/22. Considerar nota fiscal quitada após débito em
        sua c/c. Unidade faz parte de sistema de compensação de energia. O pagamento desta conta não quita
        débitos anteriores. Para estes, estão sujeitas penalidades legais vigentes (multas) e/ou atualização financeira
        (juros)baseadas no vencimento das mesmas. Leitura realizada conforme calendário de faturamento. É dever
        do consumidor manter os dados cadastrais sempre atualizados e informar alterações da atividade exercida no
        local.   DEZ/23 Band. Verde - JAN/24 Band. Verde.
    `;

  beforeEach(() => {
    service = new EnergyBillParserService();
  });

  it('should parse a valid PDF and return a ParsedEnergyBill', async () => {
    (pdfParse as jest.Mock).mockResolvedValue({ text: mockPdfText });

    const buffer = Buffer.from('fake pdf data');

    const result: Either<EnergyBillParserError, any> = await service.parse(
      buffer
    );

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.clientName).toBe(
        'SELFWAY TREINAMENTO PERSONALIZADO LTDA'
      );
      expect(result.value.clientNumber).toBe('7202210726');
      expect(result.value.installationNumber).toBe('3001422762');
      expect(result.value.totalValue).toBe(66.62);
      expect(result.value.billBarCode).toBe(
        '83670000000-0 66620138002-7 91607372233-9 08128696724-5'
      );
    }
  });

  it('should return an error if PDF parsing fails', async () => {
    (pdfParse as jest.Mock).mockRejectedValue(new Error('Parsing failed'));

    const buffer = Buffer.from('fake pdf data');
    const result = await service.parse(buffer);

    expect(result.isWrong()).toBe(true);
    if (result.isWrong()) {
      expect(result.value).toBeInstanceOf(Error);
      expect(result.value.message).toBe('Parsing failed');
    }
  });

  it('should throw an error if a required field is missing', () => {
    const mockInvalidPdfText = '';

    expect(() => service.mountParsedObject(mockInvalidPdfText)).toThrow();
  });
});
