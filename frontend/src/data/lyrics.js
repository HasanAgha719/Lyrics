import marsiya from './marsiya.json';
import nouhay from './nouhay.json';
import salaam from './salaam.json';
import manqabat from './manqabat.json';

const lyrics = [
  ...marsiya.map((lyric) => ({
    ...lyric,
    category: 'Marsiya'
  })),

  ...nouhay.map((lyric) => ({
    ...lyric,
    category: 'Nouhay'
  })),

  ...salaam.map((lyric) => ({
    ...lyric,
    category: 'Salaam'
  })),
  ...manqabat.map((lyric) => ({
    ...lyric,
    category: 'Manqabat'
  }))
];

export default lyrics;