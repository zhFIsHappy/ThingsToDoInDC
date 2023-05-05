const {createProxyMiddleware} =require('http-proxy-middleware')

module.exports =function(app){
    app.use(
        createProxyMiddleware("/api",{
            target:"http://localhost:4000",
            changeOirgin : true,
            pathRewrite : {
                "^/api" : ""
            },
            cors: {
              origin: '*',
              methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
              preflightContinue: false,
              optionsSuccessStatus: 204,
            },
        }
    ));
};


