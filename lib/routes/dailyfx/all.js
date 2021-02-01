const got = require('@/utils/got');
const parser = require('@/utils/rss-parser');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    let title = "dailyFx",
        link,
        description;

    link = "https://www.dailyfxasia.com/feeds/all";
    const feed = await parser.parseURL(link);

    const items = await Promise.all(
        feed.items.splice(0, 5).map(async (item) => {
            const response = await got({
                method: 'get',
                url: item.link,
            });
            const $ = cheerio.load(response.data);
            const content = $('div.dfx-article-content');
            content.find('div[aria-hidden="true"]').each((i, e) => {
                $(e).remove();
            });
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
