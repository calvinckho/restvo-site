
const { RECAPTCHA_SECRET } = require('../config');

var tools               = require('../tools');
var moment              = require('moment');
var trustedPartners     = require('../data/trusted-partners');

module.exports = async function(req, res) {
  const userScore = await handleCaptcha(req.body);

  if (typeof userScore !== 'number' || userScore < .4) {
    console.error("Captcha failed");
    return;
  }

  // add timestamp to form fields
  req.body.timestamp = moment().utc().format();

  // automatically send to brody, but also send to the TP directly, if provided
  let toEmail = [
    'ryan@ionic.io',
    'perry@ionic.io',
  ];
  let partnerEmail = getTrustedPartnerEmailByName(
    req.sanitize(req.body['selected-partner'])
  );
  if (typeof partnerEmail ==='string') {
    toEmail.push(partnerEmail)
  } else if (Array.isArray(partnerEmail)) {
    toEmail = toEmail.concat(partnerEmail);
  }
  console.log('Sending TP lead to ' + toEmail);

  req.body.country = req.header('Cf-Ipcountry');
  req.body.ip = req.header('CF-Connecting-IP');

  var m = {
    to: toEmail,
    from: 'sales@ionic.io',
    name: 'Ionic.io',
    subject: 'Trusted Partners Inquiry',
    body: objToString(req.body, req.sanitize),
  };

  if (req.sanitize(req.body.form) === 'application') {
    m.name = 'Trusted Partners Application';
  }

  tools.email(m.to, m.from, m.name, m.subject, m.body).then(function() {
    res.locals.notification = 'Message Sent';
    res.locals.notificationClass = 'white';
    res.render('trusted-partners');
  }, function(err) {
    console.error(err);
    res.locals.notification = 'Unable to send message at this time';
    res.locals.notificationClass = 'error';
    res.render('trusted-partners');
  });
};

async function handleCaptcha(body) {
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${body['g-recaptcha-response']}`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  const data = await response.json()
  return data.score;
}

function getTrustedPartnerEmailByName(name) {
  for (var i = 0; i < trustedPartners.length; i++) {
    if (trustedPartners[i].name === name) {
      return trustedPartners[i].email;
    }
  }

  return null;
}

function objToString(obj, sanitize) {
  var str = '';
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str += cap(p) + ' :: ' + sanitize(obj[p]) + '\n\r';
    }
  }
  return str;
};

function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
