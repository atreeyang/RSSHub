const got = require('@/utils/got');
const cheerio = require('cheerio');

const baseUrl = 'https://www.boc.cn/fimarkets/fm7/';
module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: baseUrl,
        headers: {
            Host: 'www.boc.cn',
        },
        responseType: 'text',
    });
    const $ = cheerio.load(response.data);

    const list = $("div.main > div > ul > li");
    const article_item = [];
    for (let i = 0; i < list.length; i++) {
        const article_el = $(list[i]);
        const item = {
            title: article_el.find('a').eq(0).text(),
            link: baseUrl + article_el.find('a').eq(0).attr('href'),
        };
        article_item.push(item);
    }
    ctx.state.data = {
        title: '中国银行外汇',
        link: baseUrl,
        item: article_item,
    };
};
