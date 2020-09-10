const Cookies     = require('cookies');
const PrismicDOM  = require('prismic-dom');
const Prismic     = require('prismic-javascript');
const Sentry             = require('@sentry/node');
let prismicAPI = null;

const { PRISMIC_ENDPOINT, PRISMIC_PREVIEW } = require('./config');

function linkResolver(doc) {
  // Define the url depending on the document type
  if (doc.type === 'article') {
    return '/resources/articles/' + doc.uid;
  } else if (doc.type === 'case_study') {
    return '/resources/case-studies/' + doc.uid;
  } else if (doc.type === 'documentation') {
    return '/resources/documentation/' + doc.uid;
  } else if (doc.type === 'customer_story') {
    return '/resources/customer-interviews/' + doc.uid;
  } else if (doc.type === 'enterprise_blog_post') {
    return '/enterprise/blog/' + doc.uid;
  } else if (doc.type === 'integration') {
    return '/integrations/' + doc.uid;
  } else if (doc.type === 'podcast') {
    return '/resources/podcasts/' + doc.uid;
  } else if (doc.type === 'thank_you') {
    return '/thank-you/' + doc.uid;
  } else if (doc.type === 'video') {
    return '/resources/videos/' + doc.uid;
  } else if (doc.type === 'webinar') {
    return '/resources/webinars/' + doc.uid;
  } else if (doc.type === 'whitepaper') {
    return '/resources/whitepapers/' + doc.uid;
  }

  // Default to homepage
  return '/';
}

function htmlSerializer (type, element, content, children) {
  const Elements = PrismicDOM.RichText.Elements;
  // give headings an ID
  switch(type) {
    case Elements.heading1:
    case Elements.heading2:
    case Elements.heading3:
    case Elements.heading4:
    case Elements.heading5:
    case Elements.heading6:
      const level = type[type.length -1]
      const id = children.join('')
                         .trim()
                         .toLowerCase()
                         .replace(/(&\w+;)/g, '')
                         .replace(/([^a-z\-\ ])/g, '')
                         .replace(/ /g, '-')
                         .replace(/--/g, '-');
      return `<h${level} id="${id}">${children.join('')}</h${level}>`;
    
    case Elements.preformatted: 
      return `<pre><code>${children.join('')}</code></pre>`;

    // Return null to stick with the default behavior for all other elements
    default:
      return null;
  }
}

async function getOne(key, value, size = 10, ordering = '') {
  return Prismic.getApi(PRISMIC_ENDPOINT)
  .then(api => {
    prismicAPI = api;
    return api.query(
      Prismic.Predicates.at(key, value),
      { pageSize : size, orderings: ordering}
    )
  })
  .catch(error => Sentry.captureException(new Error(error)))
}

module.exports = {
  prismicMiddleware: (_, res, next) => {
    res.locals.ctx = {
      endpoint: PRISMIC_ENDPOINT,
      linkResolver,
      htmlSerializer
    };
    // add PrismicDOM in locals to access them in templates.
    res.locals.PrismicDOM = PrismicDOM;
    res.locals.PRISMIC_PREVIEW = PRISMIC_PREVIEW;

    next();
  },

  getPrismicAPI: (req, _, next) => {
    // get Prismic API instance
    Prismic.api(PRISMIC_ENDPOINT, {
      req,
    }).then((api) => {
      prismicAPI = api;
      req.prismic = { api };
      next();
    }).catch((error) => {
      next(error.message);
    });
  },

  previewController: async (req, res) => {
    const { token } = req.query;
    try {
      if (!token) throw(new Error('Missing token from querystring'));

      const api = await Prismic.api(PRISMIC_ENDPOINT, { req, })
      prismicAPI = api;
      req.prismic = { api };
      console.log(api);
      const url = await req.prismic.api.previewSession(token, linkResolver, '/');
      const cookies = new Cookies(req, res);
      cookies.set(
        Prismic.previewCookie,
        token,
        { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false }
      );
      res.redirect(302, url);
    } catch(e) {
      res.send(500, e.message);
    }
  },

  getPrismic: async (req, res, next, type, uid, template) => {
    return new Promise(resolve => {
      console.log("check", type, uid)
      return req.prismic.api.getByUID(type, uid)
        .then(response => {
          delete req;
          if (response === undefined) {
            throw(new Error(`Prisimic ${type} ${uid} not found`)); 
          }
          res.render(template, response);
        })
        .then(resolve)
        .catch(error => {
          next(error.message);
        });
    });
  },

  getSingle: async (req, res, next, name, template) => {
    return new Promise(resolve => {
      return req.prismic.api.getSingle(name)
        .then(response => {
          delete req;
          if (response === undefined) {
            throw(new Error(`Prisimic page ${name} not found`)); 
          }
          res.render(template, response);
        })
        .then(resolve)
        .catch(error => {
          next(error.message);
        });
    });
  },

  getAll: async (key, value, ordering) => {
    let response = await getOne(key, value, 100, ordering);
    const pages = response.total_pages;
    let results = response.results;
    if (pages && pages > 1) {
      for(let i = 1; i < pages; i++) {
        response = await fetch(response.next_page).then(res => res.json());
        results = results.concat(response.results);
      }
    }
    return results;
  },

  announcementBarCronJob: (app) => {
    let prismicAPI;
    const checkAnnouncementBar = async () => {
      try {
        if (!prismicAPI){
          prismicAPI = await Prismic.api(PRISMIC_ENDPOINT);
        }
        app.locals.announcementBar = await prismicAPI.getSingle('announcement_bar');
      } catch(e) {
        console.error(e)
      }
    }
    checkAnnouncementBar()
    setInterval(checkAnnouncementBar, 5 * 60 * 1000 ) // update every 5 mins
  },

  getOne: getOne
}
