// هذا الكود مثالي ويحتاج إلى مكتبة للسكرابينج متوافقة مع APKPure
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const getAPKPureDownloadLink = async (gameName) => {
  const searchUrl = `https://apkpure.com/search?q=${encodeURIComponent(gameName)}`;
  const searchResponse = await fetch(searchUrl);
  const searchBody = await searchResponse.text();
  const $ = cheerio.load(searchBody);
  const gamePageUrl = 'https://apkpure.com' + $('.search-dl a').attr('href');

  const gamePageResponse = await fetch(gamePageUrl);
  const gamePageBody = await gamePageResponse.text();
  const $$ = cheerio.load(gamePageBody);
  const downloadLink = $$('#download_link').attr('href');

  return downloadLink;
};

const handler = async (m, { conn, text }) => {
  if (!text) throw 'استخدم الأمر كالتالي: *.apk [اسم اللعبة]*';
  try {
    const downloadLink = await getAPKPureDownloadLink(text);
    if (!downloadLink) throw 'لم يتم العثور على رابط التحميل.';
    await conn.sendMessage(m.chat, { text: `رابط التحميل: ${downloadLink}` }, { quoted: m });
  } catch (error) {
    await conn.sendMessage(m.chat, { text: `*[😒] خطأ: ${error.message}.*` }, { quoted: m });
  }
};

handler.help = ['apk'];
handler.tags = ['games'];
handler.command = ['apk'];

export default handler;
