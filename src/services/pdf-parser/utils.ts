const monthMap = {
  JAN: 0,
  FEV: 1,
  MAR: 2,
  ABR: 3,
  MAI: 4,
  JUN: 5,
  JUL: 6,
  AGO: 7,
  SET: 8,
  OUT: 9,
  NOV: 10,
  DEZ: 11,
};

export const monthNumberMap = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
];

export const convertToCurrency = (value?: string): number => {
  if (!value) return 0;

  const formattedString = value.replace(/\./g, '').replace(',', '.');

  const number = parseFloat(formattedString);

  return number;
};

export const convertToDate = (date: string): Date => {
  const [day, month, year] = date.split('/');

  const formattedDate = `${year}-${month}-${day}`;

  return new Date(formattedDate);
};

export const convertMonthYearToDate = (
  monthAbbreviation: string,
  year: number
): Date => {
  const monthIndex = monthMap[monthAbbreviation as keyof typeof monthMap];

  return new Date(year, monthIndex, 1);
};
