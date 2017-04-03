var client = require('cheerio-httpcli');
var request = require('request');
var fs = require('fs');
var URL = require('url');

var savedir = __dirname + "/img";
if(!fs.existsSync(savedir)) {
    fs.mkdirSync(savedir);
}

var url = "https://namu.wiki/w/" + encodeURIComponent("원더걸스");
var param = {};

client.fetch(url, param, function(err, $, res) {
    if (err) { console.log("error"); return; }

    // img 링크 추출하여 각 링크에 대해 함수 수행 --- (※5)
    $("img").each(function(idx) {
        var src = $(this).attr('src');

        if(src != undefined) {
            src = src.substring(2);
                var fname = URL.parse(src).pathname;
                fname = savedir + "/" + fname.replace(/[^a-zA-Z0-9\.]+/g, '_');

                request
                    .get("http://" + src)
                    .on('error', function(err) {
                        console.log(err);
                    })
                    .pipe(fs.createWriteStream(fname));

        }
    });
});


