const heroFeatured = [
  {
    category: "articles",
    title: "Restvo Vision & Mission"
  }
];

const resources = {
  "articles": {
    title: "Articles",
    description: "Articles showcasing best in class Ionic-built apps from some of the best companies in the world.",
    meta_description: 'Get the latest insights on mobile app development technology and trends for enterprise app development. Ionic articles provide insights into mobile strategy for enteprises and businesses alike.',
    items: [
      {
        "type": "Article",
        "title": "Restvo Vision & Mission",
        "url": "/resources/articles/vision-and-mission",
        "target": "_self",
        "action": "Read",
        "bgImage": "/img/resource-center/state-of-app-card.png",
        "bgColor": "#7D5FB0"
      },
      {
        "type": "Article",
        "title": "The Story of Restvo",
        "url": "/resources/articles/story-of-restvo",
        "target": "_self",
        "action": "Read",
        "bgImage": "/img/resource-center/roi-hybrid-native-card.png",
        "bgColor": "#4F82FF"
      },
      {
        "type": "Article",
        "title": "7 Ways to Become a Better Mentor",
        "url": "/resources/articles/7-ways-become-better-mentor",
        "target": "_self",
        "action": "Read",
        "bgImage": "/img/resource-center/article-why-developers-love-ionic.png",
        "bgColor": "#4F82FF"
      },
      {
        "type": "Article",
        "title": "We Love Acts 29!",
        "url": "/resources/articles/love-acts-29",
        "target": "_self",
        "action": "Read",
        "bgImage": "/img/resource-center/article-ionic-react-vs-react-native.png",
        "bgColor": "#282E37"
      },
      {
        "type": "Article",
        "title": "A Word on Anxiety",
        "url": "/resources/articles/a-word-on-anxiety",
        "target": "_self",
        "action": "Read",
        "bgImage": "/img/resource-center/article-capacitor-vs-cordova.png",
        "bgColor": "#51A7FF"
      },
      {
        "type": "Article",
        "title": "5 Steps to Find the Right Mentor",
        "url": "/resources/articles/5-steps-to-find-the-right-mentor",
        "target": "_self",
        "action": "Read",
        "bgImage": "/img/resource-center/ionic-vs-reactnative-card.png",
        "bgColor": "#15375f"
      }
    ]
  },
  "documentation": {
    title: "Documentations",
    description: "Documentations showcasing best in class Ionic-built apps from some of the best companies in the world.",
    meta_description: 'Read how Ionic customers have leveraged Ionic solutions to achieve success on business critical projects within their organizations.',
    items: [
      {
        "type": "Documentation",
        "title": "Step-by-Step Guide to Create New Coaching Relationship",
        "url": "/resources/documentation/create-new-coaching-relationship",
        "target": "_self",
        "action": "Read",
        "bgImage": "/img/resource-center/amtrak-card.png",
        "bgColor": "#2C4186"
      }
    ]
  },
  "case-studies": {
    title: "Documentations",
    description: "Documentations showcasing best in class Ionic-built apps from some of the best companies in the world.",
    meta_description: 'Read how Ionic customers have leveraged Ionic solutions to achieve success on business critical projects within their organizations.',
    items: [
    ]
  },
  "customer-interviews": {
    title: "Customer Interviews",
    description: "Customer Interviews from developers and companies.",
    meta_description: 'Read how Ionic customers have leveraged Ionic solutions to acheive success on business critical projects within their organizations.',
    items: [
      {
        "type": "Customer Interviews",
        "title": "Seth at K12",
        "url": "/resources/customer-interviews/seth-k12",
        "action": "Read",
        "bgImage": "/img/resource-center/customer-interview-k12.jpg",
        "bgColor": "#9d9849"
      }, {
        "type": "Customer Interviews",
        "title": "Danya at CGI",
        "url": "/resources/customer-interviews/danya-cgi",
        "action": "Read",
        "bgImage": "/img/resource-center/customer-interview-cgi.jpg",
        "bgColor": "#e2465c"
      }
    ]
  },
  "webinars": {
    title: "Webinars",
    description: "Webinars showcasing best in class Ionic-built apps from some of the best companies in the world.",
    meta: "Ionic Resources: Webinars for developers and architects",
    meta_description: 'Check out Ionic resources and view the white papers, webinars, videos and more we have created to help developers understand why Ionic and cross platform development is the right choices for them.',
    items: [
      {
        "type": "Webinar",
        "title": "Appflow: Push to App Stores",
        "url": "https://ionicframework.com/resources/webinars/appflow-push-to-app-stores",
        "action": "Watch",
        "bgImage": "/img/resource-center/webinar-deploy-to-appstore.png",
        "bgColor": "#6966f3"
      },
    ]
  },
  "videos": {
    title: "Videos",
    description: "Videos showcasing best in class Ionic-built apps from some of the best companies in the world.",
    meta_description: 'Get the latest videos and tutorials on how to build apps using Ionic. Build amazing cross platform apps with the web.',
    items: [
      {
        "type": "Video",
        "title": "The Ionic Show: Episode 10",
        "url": "https://www.youtube.com/watch?v=DzFLisvjgQ0&t=305s",
        "action": "Watch",
        "bgImage": "/img/resource-center/video-ionic-show-10.png",
        "bgColor": "#f07e74"
      }
    ]
  }
}

const colors = [
  '#7ac9ee',
  '#f66b7b',
  '#db83e8',
  '#262d63',
  '#121e30',
  '#535582',
  '#f8926b',
  '#7dc0ff',
  '#62aff1',
  '#ffcf5a',
  '#a382e7'
];

let sectionFeatured = [];

Object.keys(resources).forEach((category, index) => {
  // set color for each card
  const colorShuffle = shuffle(colors.slice(0));
  resources[category].items.map((o, i) => {
    if (!o.bgColor) {
      o.bgColor = colorShuffle[i % colorShuffle.length];
    }
  });

  // get the first 4 resources from each section to be featured on the homepage,
  // but only if they aren't featured in the hero
  let candidates = resources[category].items.slice(0);
  heroFeatured.map(resource => {
    if (resource.category === category)
      candidates = candidates.filter(o => o.title !== resource.title);
  }
  );
  sectionFeatured[category] = candidates.slice(0, 4);
});

// for use on enterprise page
let gallery = [{
  category: "articles",
  title: "Hybrid Vs. Native ebook",
}, {
  category: "case-studies",
  title: "Amtrak",
}, {
  category: "articles",
  title: "PWA Architects Guide",
}, {
  category: "webinars",
  title: "Building Ionic Applications for Zebra Devices",
}];

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = {
  heroFeatured: heroFeatured.map(o => resources[o.category].items.find(r => r.title === o.title)),
  sectionFeatured: sectionFeatured,
  gallery: gallery.map(o => resources[o.category].items.find(r => r.title === o.title)),
  resources: resources
};
