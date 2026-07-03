export interface BrazilState {
  code: string;
  name: string;
  capital: string;
  lat: number;
  lon: number;
}

export const brazilStates: BrazilState[] = [
  { code: 'AC', name: 'Acre', capital: 'Rio Branco', lat: -9.9747, lon: -67.8100 },
  { code: 'AL', name: 'Alagoas', capital: 'Maceió', lat: -9.6658, lon: -35.7353 },
  { code: 'AP', name: 'Amapá', capital: 'Macapá', lat: 0.0349, lon: -51.0694 },
  { code: 'AM', name: 'Amazonas', capital: 'Manaus', lat: -3.1190, lon: -60.0217 },
  { code: 'BA', name: 'Bahia', capital: 'Salvador', lat: -12.9714, lon: -38.5124 },
  { code: 'CE', name: 'Ceará', capital: 'Fortaleza', lat: -3.7172, lon: -38.5433 },
  { code: 'DF', name: 'Distrito Federal', capital: 'Brasília', lat: -15.7975, lon: -47.8919 },
  { code: 'ES', name: 'Espírito Santo', capital: 'Vitória', lat: -20.3155, lon: -40.3128 },
  { code: 'GO', name: 'Goiás', capital: 'Goiânia', lat: -16.6869, lon: -49.2648 },
  { code: 'MA', name: 'Maranhão', capital: 'São Luís', lat: -2.5297, lon: -44.2825 },
  { code: 'MT', name: 'Mato Grosso', capital: 'Cuiabá', lat: -15.6014, lon: -56.0979 },
  { code: 'MS', name: 'Mato Grosso do Sul', capital: 'Campo Grande', lat: -20.4697, lon: -54.6201 },
  { code: 'MG', name: 'Minas Gerais', capital: 'Belo Horizonte', lat: -19.9167, lon: -43.9345 },
  { code: 'PA', name: 'Pará', capital: 'Belém', lat: -1.4558, lon: -48.5024 },
  { code: 'PB', name: 'Paraíba', capital: 'João Pessoa', lat: -7.1195, lon: -34.8450 },
  { code: 'PR', name: 'Paraná', capital: 'Curitiba', lat: -25.4284, lon: -49.2733 },
  { code: 'PE', name: 'Pernambuco', capital: 'Recife', lat: -8.0476, lon: -34.8770 },
  { code: 'PI', name: 'Piauí', capital: 'Teresina', lat: -5.0892, lon: -42.8019 },
  { code: 'RJ', name: 'Rio de Janeiro', capital: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
  { code: 'RN', name: 'Rio Grande do Norte', capital: 'Natal', lat: -5.7945, lon: -35.2110 },
  { code: 'RS', name: 'Rio Grande do Sul', capital: 'Porto Alegre', lat: -30.0346, lon: -51.2177 },
  { code: 'RO', name: 'Rondônia', capital: 'Porto Velho', lat: -8.7612, lon: -63.9004 },
  { code: 'RR', name: 'Roraima', capital: 'Boa Vista', lat: 2.8195, lon: -60.6714 },
  { code: 'SC', name: 'Santa Catarina', capital: 'Florianópolis', lat: -27.5954, lon: -48.5480 },
  { code: 'SP', name: 'São Paulo', capital: 'São Paulo', lat: -23.5505, lon: -46.6333 },
  { code: 'SE', name: 'Sergipe', capital: 'Aracaju', lat: -10.9091, lon: -37.0677 },
  { code: 'TO', name: 'Tocantins', capital: 'Palmas', lat: -10.1689, lon: -48.3317 },
];

export const stateCentroids: Record<string, [number, number]> = Object.fromEntries(
  brazilStates.map(s => [s.code, [s.lat, s.lon]])
);

export const stateNames: Record<string, string> = Object.fromEntries(
  brazilStates.map(s => [s.code, s.name])
);

// Major cities for search
export interface City {
  name: string;
  state: string;
  stateCode: string;
  lat: number;
  lon: number;
}

export const majorCities: City[] = [
  { name: 'São Paulo', state: 'São Paulo', stateCode: 'SP', lat: -23.5505, lon: -46.6333 },
  { name: 'Rio de Janeiro', state: 'Rio de Janeiro', stateCode: 'RJ', lat: -22.9068, lon: -43.1729 },
  { name: 'Brasília', state: 'Distrito Federal', stateCode: 'DF', lat: -15.7975, lon: -47.8919 },
  { name: 'Salvador', state: 'Bahia', stateCode: 'BA', lat: -12.9714, lon: -38.5124 },
  { name: 'Fortaleza', state: 'Ceará', stateCode: 'CE', lat: -3.7172, lon: -38.5433 },
  { name: 'Belo Horizonte', state: 'Minas Gerais', stateCode: 'MG', lat: -19.9167, lon: -43.9345 },
  { name: 'Manaus', state: 'Amazonas', stateCode: 'AM', lat: -3.1190, lon: -60.0217 },
  { name: 'Curitiba', state: 'Paraná', stateCode: 'PR', lat: -25.4284, lon: -49.2733 },
  { name: 'Recife', state: 'Pernambuco', stateCode: 'PE', lat: -8.0476, lon: -34.8770 },
  { name: 'Goiânia', state: 'Goiás', stateCode: 'GO', lat: -16.6869, lon: -49.2648 },
  { name: 'Belém', state: 'Pará', stateCode: 'PA', lat: -1.4558, lon: -48.5024 },
  { name: 'Porto Alegre', state: 'Rio Grande do Sul', stateCode: 'RS', lat: -30.0346, lon: -51.2177 },
  { name: 'São Luís', state: 'Maranhão', stateCode: 'MA', lat: -2.5297, lon: -44.2825 },
  { name: 'Maceió', state: 'Alagoas', stateCode: 'AL', lat: -9.6658, lon: -35.7353 },
  { name: 'Campo Grande', state: 'Mato Grosso do Sul', stateCode: 'MS', lat: -20.4697, lon: -54.6201 },
  { name: 'Teresina', state: 'Piauí', stateCode: 'PI', lat: -5.0892, lon: -42.8019 },
  { name: 'João Pessoa', state: 'Paraíba', stateCode: 'PB', lat: -7.1195, lon: -34.8450 },
  { name: 'Natal', state: 'Rio Grande do Norte', stateCode: 'RN', lat: -5.7945, lon: -35.2110 },
  { name: 'Cuiabá', state: 'Mato Grosso', stateCode: 'MT', lat: -15.6014, lon: -56.0979 },
  { name: 'Aracaju', state: 'Sergipe', stateCode: 'SE', lat: -10.9091, lon: -37.0677 },
  { name: 'Florianópolis', state: 'Santa Catarina', stateCode: 'SC', lat: -27.5954, lon: -48.5480 },
  { name: 'Vitória', state: 'Espírito Santo', stateCode: 'ES', lat: -20.3155, lon: -40.3128 },
  { name: 'Porto Velho', state: 'Rondônia', stateCode: 'RO', lat: -8.7612, lon: -63.9004 },
  { name: 'Boa Vista', state: 'Roraima', stateCode: 'RR', lat: 2.8195, lon: -60.6714 },
  { name: 'Macapá', state: 'Amapá', stateCode: 'AP', lat: 0.0349, lon: -51.0694 },
  { name: 'Rio Branco', state: 'Acre', stateCode: 'AC', lat: -9.9747, lon: -67.8100 },
  { name: 'Palmas', state: 'Tocantins', stateCode: 'TO', lat: -10.1689, lon: -48.3317 },
  // Additional cities
  { name: 'Campinas', state: 'São Paulo', stateCode: 'SP', lat: -22.9099, lon: -47.0626 },
  { name: 'Guarulhos', state: 'São Paulo', stateCode: 'SP', lat: -23.4538, lon: -46.5333 },
  { name: 'Santos', state: 'São Paulo', stateCode: 'SP', lat: -23.9608, lon: -46.3336 },
  { name: 'Ribeirão Preto', state: 'São Paulo', stateCode: 'SP', lat: -21.1767, lon: -47.8208 },
  { name: 'Sorocaba', state: 'São Paulo', stateCode: 'SP', lat: -23.5015, lon: -47.4526 },
  { name: 'São José dos Campos', state: 'São Paulo', stateCode: 'SP', lat: -23.1791, lon: -45.8872 },
  { name: 'Niterói', state: 'Rio de Janeiro', stateCode: 'RJ', lat: -22.8833, lon: -43.1036 },
  { name: 'Petrópolis', state: 'Rio de Janeiro', stateCode: 'RJ', lat: -22.5100, lon: -43.1781 },
  { name: 'Búzios', state: 'Rio de Janeiro', stateCode: 'RJ', lat: -22.7472, lon: -41.8819 },
  { name: 'Ilha Comprida', state: 'São Paulo', stateCode: 'SP', lat: -24.8333, lon: -47.8000 },
  { name: 'Ubatuba', state: 'São Paulo', stateCode: 'SP', lat: -23.4342, lon: -45.0878 },
  { name: 'Caraguatatuba', state: 'São Paulo', stateCode: 'SP', lat: -23.6201, lon: -45.4130 },
  { name: 'São Sebastião', state: 'São Paulo', stateCode: 'SP', lat: -23.7600, lon: -45.4050 },
  { name: 'Maringá', state: 'Paraná', stateCode: 'PR', lat: -23.4210, lon: -51.9331 },
  { name: 'Londrina', state: 'Paraná', stateCode: 'PR', lat: -23.3045, lon: -51.1696 },
  { name: 'Ponta Grossa', state: 'Paraná', stateCode: 'PR', lat: -25.0945, lon: -50.1633 },
  { name: 'Joinville', state: 'Santa Catarina', stateCode: 'SC', lat: -26.3045, lon: -48.8487 },
  { name: 'Blumenau', state: 'Santa Catarina', stateCode: 'SC', lat: -26.9194, lon: -49.0661 },
  { name: 'Chapecó', state: 'Santa Catarina', stateCode: 'SC', lat: -27.0978, lon: -52.6175 },
  { name: 'Caxias do Sul', state: 'Rio Grande do Sul', stateCode: 'RS', lat: -29.1681, lon: -51.1794 },
  { name: 'Pelotas', state: 'Rio Grande do Sul', stateCode: 'RS', lat: -31.7649, lon: -52.3371 },
  { name: 'Santa Maria', state: 'Rio Grande do Sul', stateCode: 'RS', lat: -29.6842, lon: -53.8069 },
  { name: 'Juiz de Fora', state: 'Minas Gerais', stateCode: 'MG', lat: -21.7579, lon: -43.3569 },
  { name: 'Uberlândia', state: 'Minas Gerais', stateCode: 'MG', lat: -18.9186, lon: -48.2772 },
  { name: 'Governador Valadares', state: 'Minas Gerais', stateCode: 'MG', lat: -18.8560, lon: -41.9537 },
  { name: 'Ilhéus', state: 'Bahia', stateCode: 'BA', lat: -14.7886, lon: -39.0493 },
  { name: 'Porto Seguro', state: 'Bahia', stateCode: 'BA', lat: -16.4435, lon: -39.0647 },
  { name: 'Lençóis Paulista', state: 'São Paulo', stateCode: 'SP', lat: -22.5986, lon: -48.8003 },
];
