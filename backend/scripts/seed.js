import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Lyric from '../models/Lyric.js';

dotenv.config();

const sampleLyrics = [
  // 1. Salaam - Imam Hussain (ع)
  {
    title: 'Salaam-e-Hussain',
    category: 'Salaam',
    person: 'Imam Hussain (ع)',
    reciter: 'Mir Hassan Mir',
    lyricsEnglish: `Salaam ya Hussain, jaan-e-Fatima salaam\nSalaam ya Hussain, ibne-Mustafa salaam\n\nTumhara gham humari rooh ki ghiza bana\nTumhare dard se hi dil ka rasta bana\nKarbala ki dhool ka har ek zarra kah raha\nSalaam ya Hussain, jaan-e-Fatima salaam.`,
    lyricsUrdu: `سلام یا حسین، جانِ فاطمہ سلام\nسلام یا حسین، ابنِ مصطفیٰ سلام\n\nتمہارا غم ہماری روح کی غذا بنا\nتمہارے درد سے ہی دل کا راستہ بنا\nکربلا کی دھول کا ہر ایک ذرہ کہہ رہا\nسلام یا حسین، جانِ فاطمہ سلام۔`,
    orderNumber: 1
  },
  {
    title: 'Ya Hussain Ya Hussain',
    category: 'Salaam',
    person: 'Imam Hussain (ع)',
    reciter: 'Nadeem Sarwar',
    lyricsEnglish: `Ya Hussain, Ya Hussain, karam kijiyay\nApne ashiqon pe ik nazar kijiyay\n\nKarbala ki zameen yaad ati hai hume\nApni chokhat pe bulwa kar ehsaam kijiyay\nYa Hussain Ya Hussain, karam kijiyay.`,
    lyricsUrdu: `یا حسین، یا حسین، کرم کیجیے\nاپنے عاشقوں پہ اک نظر کیجیے\n\nکربلا کی زمین یاد آتی ہے ہمیں\nاپنی چوکھٹ پہ بلوا کر احسان کیجیے\nیا حسین یا حسین، کرم کیجیے.`,
    orderNumber: 2
  },

  // 2. Salaam - Hazrat Abbas (ع)
  {
    title: 'Salam-e-Abbas',
    category: 'Salaam',
    person: 'Hazrat Abbas (ع)',
    reciter: 'Ali Shanawar',
    lyricsEnglish: `Salaam ya Alamdar-e-Lashkar salaam\nSalaam ya ghazi, ba-wafa salaam\n\nAbbas ghazi tum pe humara salaam ho\nSakka-e-harame shah pe lakhon salaam ho\nBazu kalam kara ke bacha li wafaye ishq\nSalaam ya ghazi, ba-wafa salaam.`,
    lyricsUrdu: `سلام یا علمدارِ لشکر سلام\nسلام یا غازی، باوفا سلام\n\nعباس غازی تم پہ ہمارا سلام ہو\nسقائے حرمِ شاہ پہ لاکھوں سلام ہو\nبازو قلم کرا کے بچا لی وفائے عشق\nسلام یا غازی، باوفا سلام۔`,
    orderNumber: 1
  },
  {
    title: 'Ya Abbas Alamdar',
    category: 'Salaam',
    person: 'Hazrat Abbas (ع)',
    reciter: 'Mir Hassan Mir',
    lyricsEnglish: `Ya Abbas, Ya Abbas, bazu kalam huay par parcham na jhuka\nAbbas ka alam le kar chala lashkar-e-wafa\n\nFurat par jo pahoncha to paani na piya\nBibi Sakina ke liye apna khoon diya\nYa Abbas, Ya Abbas, bazu kalam huay.`,
    lyricsUrdu: `یا عباس، یا عباس، بازو قلم ہوئے پر پرچم نہ جھکا\nعباس کا علم لے کر چلا لشکرِ وفا\n\nفرات پر جو پہنچا تو پانی نہ پیایا\nبی بی سکینہ کے لیے اپنا خون دیا\nیا عباس، یا عباس، بازو قلم ہوئے۔`,
    orderNumber: 2
  },

  // 3. Salaam - Bibi Zainab (س)
  {
    title: 'Salaam Ya Zainab',
    category: 'Salaam',
    person: 'Bibi Zainab (س)',
    reciter: 'Ali Jee',
    lyricsEnglish: `Salaam ya sani-e-Zahra salaam\nSalaam ya sher-dil Zainab salaam\n\nKarbobala me sabr ka saaye bani rahin\nDarbaar me bhi khutba-e-haider sunati rahin\nZindaan me ghurbat pe teri dil laraz utha\nSalaam ya sani-e-Zahra salaam.`,
    lyricsUrdu: `سلام یا ثانیِ زہرا سلام\nسلام یا شیرِ دل زینب سلام\n\nکربوبلا میں صبر کا سائے بنی رہیں\nدربار میں بھی خطبہِ حیدر سناتی رہیں\nزندان میں غربت پہ تیری دل لرز اٹھا\nسلام یا ثانیِ زہرا سلام۔`,
    orderNumber: 1
  },

  // 4. Nouhay - Imam Hussain (ع)
  {
    title: 'Hussain Al-Wida',
    category: 'Nouhay',
    person: 'Imam Hussain (ع)',
    reciter: 'Nadeem Sarwar',
    lyricsEnglish: `Alwida alwida ya Hussain alwida\nZainab pukarti thi bhayya alwida\n\nRukhsat chali hai behn zindaan ki taraf\nChora hai lashkar tera maqtal ki taraf\nSar pe rida nahi hai bhayya alwida\nAlwida alwida ya Hussain alwida.`,
    lyricsUrdu: `الوداع الوداع یا حسین الوداع\nزینب پکارتی تھی بھیا الوداع\n\nرخصت چلی ہے بہن زندان کی طرف\nچھوڑا ہے لشکر تیرا مقتل کی طرف\nسر پہ ردا نہیں ہے بھیا الوداع\nالوداع الوداع یا حسین الوداع۔`,
    orderNumber: 1
  },

  // 5. Nouhay - Hazrat Ali Asghar (ع)
  {
    title: 'Lori Lori Asghar',
    category: 'Nouhay',
    person: 'Hazrat Ali Asghar (ع)',
    reciter: 'Farhan Ali Waris',
    lyricsEnglish: `So jao mere laal, lori lori\nAsghar pyare so jao, lori lori\n\nKhoon se tera jhoola sajaya gaya laal\nTeer-e-sitampardaz se tujhe sulaya gaya laal\nMaa dhundti hai jhoole me tujhe ro ro kar\nSo jao mere laal, lori lori.`,
    lyricsUrdu: `سو جاؤ میرے لال، لوری لوری\nاصغر پیارے سو جاؤ، لوری لوری\n\nخون سے تیرا جھولا سجایا گیا لال\nتیرِ ستم پرداز سے تجھے سلایا گیا لال\nماں ڈھونڈتی ہے جھولے میں تجھے رو رو کر\nسو جاؤ میرے لال، لوری لوری۔`,
    orderNumber: 1
  },

  // 6. Nouhay - Hazrat Abbas (ع)
  {
    title: 'Abbas Ka Alam',
    category: 'Nouhay',
    person: 'Hazrat Abbas (ع)',
    reciter: 'Mir Hassan Mir',
    lyricsEnglish: `Abbas ka alam le kar chalna hai har gali\nWafa ki dastan sunata hai alam-e-ghazi\n\nKhoon me naha gaya tha alamdar ba-wafa\nBazu kalam huay par himmat na hari\nAbbas ka alam le kar chalna hai har gali.`,
    lyricsUrdu: `عباس کا علم لے کر چلنا ہے ہر گلی\nوفا کی داستان سناتا ہے علمِ غازی\n\nخون میں نہا گیا تھا علمدار باوفا\nبازو قلم ہوئے پر ہمت نہ ہاری\nعباس کا علم لے کر چلنا ہے ہر گلی۔`,
    orderNumber: 1
  },

  // 7. Marsiya - Imam Hussain (ع)
  {
    title: 'Ghabraegi Zainab',
    category: 'Marsiya',
    person: 'Imam Hussain (ع)',
    reciter: 'Mir Hasan Mir',
    lyricsEnglish: `Ghabraegi Zainab, ghabraegi Zainab\nBhayya ke bina sham me rulaye gi Zainab\n\nLut kar chala hai karwan zainab-e-lachaar ka\nHar simt se aawaz hai mazloom-e-karbala\nKhaimo ki aag dil ko jalaye gi Zainab\nGhabraegi Zainab, ghabraegi Zainab.`,
    lyricsUrdu: `گھبرائے گی زینب، گھبرائے گی زینب\nبھیا کے بنا شام میں رلائے گی زینب\n\nلٹ کر چلا ہے کارواں زینبِ لاچار کا\nہر سمت سے آواز ہے مظلومِ کربلا\nخیموں کی آگ دل کو جلائے گی زینب\nگھبرائے گی زینب، گھبرائے گی زینب۔`,
    orderNumber: 1
  },

  // 8. Manqabat - Imam Ali (ع)
  {
    title: 'Ali Ali Ya Ali',
    category: 'Manqabat',
    person: 'Imam Ali (ع)',
    reciter: 'Nadeem Sarwar',
    lyricsEnglish: `Ali Ali kehna meri aadat hai\nAli ki wilayat hi meri ibadat hai\n\nKaba me janam haider-e-karrar ka hua\nMushkil kusha hai wo har ek zaar ka\nAli Ali kehna meri aadat hai.`,
    lyricsUrdu: `علی علی کہنا میری عادت ہے\nعلی کی ولایت ہی میری عبادت ہے\n\nکعبہ میں جنم حیدرِ کرار کا ہوا\nمشکل کشا ہے وہ har اک زار کا\nعلی علی کہنا میری عادت ہے۔`,
    orderNumber: 1
  },

  // 9. Qasiday - Imam Ali (ع)
  {
    title: 'Dam Mast Qalandar',
    category: 'Qasiday',
    person: 'Imam Ali (ع)',
    reciter: 'Nusrat Fateh Ali Khan',
    lyricsEnglish: `Dam mast Qalandar mast mast, ali dam dam de andar mast mast\nMera vird-e-zabaan hai naam-e-ali, dil mast qalandar mast mast\nAli imaan ali jaan, jahan-e-ilm-o-irfaan\nLakhon salaam ya mushkil kusha ali.`,
    lyricsUrdu: `دم مست قلندر مست مست، علی دم دم دے اندر مست مست\nمیرا وردِ زبان ہے نامِ علی، دل مست قلندر مست مست\nعلی ایمان علی جان، جہانِ علم و عرفان\nلاکھوں سلام یا مشکل کشا علی۔`,
    orderNumber: 1
  },

  // 10. Munaajaat - Imam Ali (ع)
  {
    title: 'Munajat-e-Imam Ali',
    category: 'Munaajaat',
    person: 'Imam Ali (ع)',
    reciter: 'Abather Al-Halwachi',
    lyricsEnglish: `Moula ya moula, anta al-moula wa ana al-abd\nMoula ya moula, anta al-khaliq wa ana al-makhlooq\n\nKaram farma mujh pe ya illahi, mushkil kusha ke sadqe\nGunaho se mujhe pak karde ya rab.`,
    lyricsUrdu: `مولا یا مولا، انت المولیٰ و انا العبد\nمولا یا مولا، انت الخالق و انا المخلوق\n\nکرم فرما مجھ پہ یا الٰہی، مشکل کشا کے صدقے\nگناہوں سے مجھے پاک کر دے یا رب۔`,
    orderNumber: 1
  },

  // 11. Ziyaraat - Imam Hussain (ع)
  {
    title: 'Ziyarat-e-Ashura',
    category: 'Ziyaraat',
    person: 'Imam Hussain (ع)',
    reciter: 'Ali Fani',
    lyricsEnglish: `Assalamu alaika ya Aba Abdillah\nAssalamu alaika yabna Rasoolillah\n\nAssalamu alaika wa alal arwahil lati hallat bi fina'ik\nAlaika minni salamullahi abadan ma baqiytu wa baqiyal laylu wan nahar.`,
    lyricsUrdu: `اَلسَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللهِ\nاَلسَّلَامُ عَلَيْكَ يَا بْنَ رَسُولِ اللهِ\n\nاَلسَّلَامُ عَلَيْكَ وَعَلَى الْأَرْوَاحِ الَّتِي حَلَّتْ بِفِنَائِكَ\nعَلَيْكَ مِنِّي سَلَامُ اللهِ أَبَداً مَا بَقِيتُ وَبَقِيَ اللَّيْلُ وَالنَّهَارُ۔`,
    orderNumber: 1
  },

  // 12. Duas - Allah (swt)
  {
    title: 'Dua-e-Kumayl',
    category: 'Duas',
    person: 'Allah (swt)',
    reciter: 'Maytham Al-Tamar',
    lyricsEnglish: `Allahumma inni as'aluka bi rahmatikal lati wasi'at kulla shay\nWa bi quwwatikal lati qaharta biha kulla shay\n\nWa khada'a laha kullu shay, wa dhalla laha kullu shay\nFaghfirliyal dhunooballati tahtikul 'isam.`,
    lyricsUrdu: `اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ\nوَبِقُوَّتِكَ الَّتِي قَهَرْتَ بِهَا كُلَّ شَيْءٍ\n\nوَخَضَعَ لَهَا كُلُّ شَيْءٍ، وَذَلَّ لَهَا كُلُّ شَيْءٍ\nفَاغْفِرْ لِيَ الذُّنُوبَ الَّتِي تَهْتِكُ الْعِصَمَ۔`,
    orderNumber: 1
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing lyrics
    await Lyric.deleteMany({});
    console.log('Existing lyrics deleted.');

    // Insert sample data
    await Lyric.insertMany(sampleLyrics);
    console.log('Sample lyrics seeded successfully.');

    // Close connection
    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
