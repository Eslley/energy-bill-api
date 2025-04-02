export const abbreviateReferenceDate = (referenceDate: Date): string => {
  const monthYear =
    `${referenceDate.getMonth() + 1}`.padStart(2, '0') +
    '/' +
    referenceDate.getFullYear().toString().slice(2);

  const [month, year] = monthYear.split('/');

  const monthNames = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];

  const abbreviatedMonth = monthNames[parseInt(month, 10) - 1];
  return `${abbreviatedMonth}/${year}`;
};
