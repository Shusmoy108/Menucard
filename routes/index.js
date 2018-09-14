var express = require('express');
var router = express.Router();
var Foods       		= require('../models/Foods');
var Resturants       		= require('../models/Restaurants');

var Handlebars=require('hbs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/menu/:resturant_name', function(req, res, next) {
    var resturant_name;
    var count=0;
    resturant_name = req.params.resturant_name;
  Resturants.findOne({ 'name' :  resturant_name }, function(err, resturant) {
    var res_id= resturant._id;
    Foods.aggregate([
          {
              $group: {
                  _id: "$category",
                  entries: { $push: "$$ROOT" }
              }
          }
      ], function (err, Foods) {
          if (err) {
              cb(err, null);
          }
          else {
            //console.log(Foods);
            //console.log(res_id);

            res.render('index', { Foods:Foods,count:count,res_id:res_id,res_name:resturant_name,title: 'Express' });

          }
      });

  });
});
router.post('/menuplus', function(req, res, next) {

    var data= req.body.data.split("$");
    orderplus(data[0],data[1],data[2]);
    console.log();
    res.send(req.body);

});

var orderedfood=[];
router.post('/senddata', function(req, res){
    var obj = {};
    orderedfood=req.body.message;
    console.log('body: ' + req.body.orderdfood);
    res.send(req.body);
});



Handlebars.registerHelper('CreateMenuCard',function (Foods,Res_id,res_name,count) {
    if(Foods.length < 1 || Foods == undefined){
        return new Handlebars.SafeString("");
    }
    var page="";

    Foods.forEach((food, index) => {
        page+="<div><h3>"+ food._id+"</h3></div>";
        food.entries.forEach((food, ind) => {
            page+="<div class='row' style='margin: 5px 0px; '>" +
                "<div class='col-xs-4 col-sm-6'>" +
                " <div style='font-size: 15px; font-style: bold' id='food_name'>"+food.food_name+"</div>"+
                "<div style='font-size: 10px; color: #263238;'>"+ food.desc+"</div>"+
                "</div>";
            if(Array.isArray(food.food_size)){
                page+="";
                var f=1;
                food.food_size.forEach((food_size,inde) =>{
                    var param="food_data$"+ind+""+index+""+inde;
                    var minus="minus"+ind+""+index+""+inde;
                    console.log(param);
                    if(food.food_size.length>1){
                        if(f==1){
                            page+="<div class='col-xs-8 col-sm-6'>";
                            f=0;
                        }
                        page += "<div class='row'> <div class='col-xs-3 col-sm-2' style='font-size: 12px;padding-top: 5px;' >" + food_size.size  + "</div> " +
                            "<div class='col-xs-3 col-sm-2' style='font-size: 12px;padding-top: 5px;'  >"+ "৳" + food_size.price + "</div> " +
                            "<div class='col-xs-6 col-sm-6' style='margin-bottom: 5px;' ><button class='btn btn-success' onclick='plus(" + param + ")'><span class='glyphicon glyphicon-plus'></span><div id='" + param + "' hidden>" + food.food_name + "$" + food_size.size + "$" + food_size.price + "</div></button>" +
                            "<button style='visibility : hidden;' id='" + minus + "' class='btn btn-danger' onclick='minus(" + param + ")'><span class='glyphicon glyphicon-minus'></span></button><div id='food_data' hidden>" + food.food_name + "$" + food_size.size + "$" + food_size.price + "</div></div></div>" ;

                    }
                    else {
                        page += "<div class='col-xs-2 col-sm-1' style='font-size: 12px;padding-top: 5px;' >" + food_size.size + "</div> " +
                            "<div class='col-xs-2 col-sm-1' style='font-size: 12px;padding-top: 5px;' >" + " ৳" + food_size.price + "</div> " +
                            "<div class='col-xs-4 col-sm-4'><button class='btn btn-success' onclick='plus(" + param + ")'><span class='glyphicon glyphicon-plus'></span><div id='" + param + "' hidden>" + food.food_name + "$" + food_size.size + "$" + food_size.price + "</div></button>" +
                            "<button style='visibility : hidden;' id='" + minus + "' class='btn btn-danger' onclick='minus(" + param + ")'><span class='glyphicon glyphicon-minus'></span></button><div id='food_data' hidden>" + food.food_name + "$" + food_size.size + "$" + food_size.price + "</div></div>" +
                            "";
                    }
                });
                page+= "</div>";
            }
        });
        page+="</div>"
    });
    console.log(page);
    return new Handlebars.SafeString(page);

});

module.exports = router;
