const allowedCors = [
    'https://praktikum.tk',
    'http://praktikum.tk',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://api.mesto.nksch.nomoredom.nomoredomains.rocks',
    'https://api.mesto.nksch.nomoredom.nomoredomains.rocks',
    'http://mesto.nksch.nomoredomains.rocks',
    'https://mesto.nksch.nomoredomains.rocks',
    'http://51.250.72.163:3000',
  ];
  
  module.exports = (req, res, next) => {
    const { origin } = req.headers; 

    if (allowedCors.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin); 
    }
  
    const { method } = req;
    const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    const requestHeaders = req.headers['access-control-request-headers']; 
  
   
    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS); 
      res.header('Access-Control-Allow-Headers', requestHeaders); 
      res.header('Access-Control-Allow-Credentials', true);
      return res.end(); 
    }
  
    return next();
  };