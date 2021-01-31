const got = require('@/utils/got');
const parser = require('@/utils/rss-parser');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    let title = 'wechat',
        link,
        description;

    link = "https://raw.githubusercontent.com/hellodword/wechat-feeds/feeds/" + ctx.params.bizid + ".xml";
    const feed = await parser.parseURL(link);

    const items = await Promise.all(
        feed.items.splice(0, 5).map(async (item) => {
            const response = await got({
                method: 'get',
                url: item.link,
            });
            const $ = cheerio.load(response.data);
            const content = $('#js_content');
            const description = content.html();

            const single = {
                title: item.title,
                description,
                link: item.link,
            };
            return Promise.resolve(single);
        })
    );

    ctx.state.data = {
        title,
        link,
        description,
        item: items,
    };
};
