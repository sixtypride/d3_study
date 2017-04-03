var client = require("cheerio-httpcli");
var urlType = require("url");

var url = "http://jpub.tistory.com";
var param = {};

client.fetch(url, param, function(err, $, res) {
    if(err) {
       console.log("Error:", err);
       return;
    }

    // console.log(res);

   // var body = $.html();
   //  console.log(body);

    $('a').each(function(idx) {
        var text = $(this).text();
        var href = $(this).attr('href');

        if(!href) return;

        var href2 = urlType.resolve(url, href);

        console.log(text + ":" + href);
        console.log("=> " + href2 + "\n");
    });

});
