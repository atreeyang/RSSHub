const got = require('@/utils/got');
const cheerio = require('cheerio');

const baseUrl = 'https://wap.boc.cn/bif/bi6/';
module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: baseUrl,
        headers: {
            Host: 'wap.boc.cn',
        },
        responseType: 'text',
    });
    const $ = cheerio.load(response.data);

    const list = $("#thelist > li");
    const article_item = [];
    var length = list.length > 10 ? 10 : list.length;
    for (let i = 0; i < length; i++) {
        const article_el = $(list[i]);
        const link = baseUrl + article_el.find('a').eq(0).attr('href');
        const description = await ctx.cache.tryGet(link, async () => {
            const fullText = await got({
                method: 'get',
                url: link,
                Host: 'wap.boc.cn',
                responseType: 'buffer',
            });
            const fullTextData = cheerio.load(fullText.data);
            return fullTextData('#BOC_CONTENT_SECTION > div').html();
        });

        const item = {
            title: article_el.find('a').eq(0).text(),
            link: link, 
            description: description,
        };
        article_item.push(item);
    }
    ctx.state.data = {
        title: '中国银行外汇',
        link: baseUrl,
        item: article_item,
    };
};
