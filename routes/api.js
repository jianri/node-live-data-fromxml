var https = require('https');
var util = require('util');
var parser = require('xml2json');
var item_number;
var xml_value;
var result;
exports.getvalue = function(req,res){
    
    if(req.query.date && req.query.email && req.query.item_number && req.query.xml_value){
        item_number = req.query.item_number;
        xml_value = req.query.xml_value;
        result = res;
        var options = {
            host:'s3-eu-west-1.amazonaws.com',
            path:'/mx-sharewall-recommend/'+req.query.date+'/'+req.query.email+'.csv',
            method:'GET'
        };
        var req = https.request(options, getItemNum);
        req.end();
        req.on('error', function(e){
            console.error('Error1:'+e);
        });
    }
};

var getItemNum = function(response){
    var str = '';
    response.on('data', function(chunk){
        str += chunk;
    });
    
    response.on('end', function(){
        var item_numbers = str.split(', ');
        //var filename = item_numbers[item_number].replace(/\s+/g, ' ');
        var options = {
            host:'s3-eu-west-1.amazonaws.com',
            path:'/mx-artikler-ai/'+item_numbers[item_number]+'.xml',
            method:'GET'
        };
        var req = https.request(options, getXMLData);
        req.end();
        req.on('error', function(e){
            console.error('Error2:'+e);
        });
    });
};

var getXMLData = function(response){
    var str = '';
    response.on('data', function(chunk){
        str += chunk;
    });
    
    response.on('end', function(){
        //str = str.replace(/\s+/g, '\n');
        var json = eval('('+parser.toJson(str)+')');
                
        var data;
        if(xml_value == "title"){
            data = json.item.title;
        }else if(xml_value == "link"){
            data = json.item.link;
        }else if(xml_value == "image"){
            data = json.item.image;
        }else if(xml_value == "description"){
            data = json.item.description;
        }else if(xml_value == "guid"){
            data = json.item.guid;
        }else if(xml_value == "category"){
            data = json.item.category;
        }else if(xml_value == "pubDate"){
            data = json.item.pubDate;
        }
        result.json(data);
    });
};