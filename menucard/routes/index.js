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
    if(req.params.resturant_name.split("$").length>1)
    {
        resturant_name=req.params.resturant_name.split("$")[0];
        count=req.params.resturant_name.split("$")[1];
    }
    else {
        resturant_name = req.params.resturant_name;
    }
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
function plus() {

    
}

var orderedfood=[];
function orderplus(food_name,food_size,food_price){
    var food={
        food_name: food_name,
        food_size:food_size,
        food_price:food_price
    }
    //orderedfood[orderedfood.length] = food;
    orderedfood.push(food);
    console.log(orderedfood);

}
function orderminus(food_name,food_size,food_price){
    var food={
        food_name: food_name,
        food_size:food_size,
        food_price:food_price
    }
    orderedfood.splice(orderedfood.indexOf(food),1);
    console.log(orderedfood);
}
router.post('/senddata', function(req, res){
    var obj = {};
    orderedfood=req.body.message;
    console.log('body: ' + req.body.orderdfood);
    res.send(req.body);
});


Handlebars.registerHelper('CreateMenuCard',function (Foods,Res_id,res_name,count) {
    var page="<div class='row'><div class='col-xs-8 col-sm-8'><h2>"+res_name+"</h2></div><div class='col-xs-4 col-sm-4'><h1>" +
        "</h1>"+
        "</div> </div> ";
    Foods.forEach((food, index) => {
        page+="<div><h3>"+ food._id+"</h3>";
        food.entries.forEach((food, ind) => {
            page+="<div class='row'>" +
                "<div class='col-xs-5 col-sm-6'>" +
                "<h4 id='food_name'>"+food.food_name+"</h4>"+
                "<h6>"+ food.desc+"</h6>"+
                "</div>";
            if(Array.isArray(food.food_size)){
                page+="";
                food.food_size.forEach((food_size,inde) =>{
                    var param="food_data"+ind+""+index+""+inde;
                    console.log(param);
                   page+=  "<form method='get'><div class='col-xs-2 col-sm-2' >"+ food_size.size+" $"+ food_size.price+"</div> "+
                    "<div class='col-xs-5 col-sm-4'><button class='btn btn-success' onclick='plus("+param+")'><span class='glyphicon glyphicon-plus'></span><div id='"+param+"' hidden>"+food.food_name+"$"+food_size.size+"$"+food_size.price+"</div></button>"+
                    "<button class='btn btn-danger' onclick='minus("+param+")'><span class='glyphicon glyphicon-minus'></span><div id='food_data' hidden>"+food.food_name+"$"+food_size.size+"$"+food_size.price+"</div></button></div>"+
                    "</form>";
                });
            }
            page+= "</div>";
        });
        page+="</div>"
    });
    console.log(page);
    return new Handlebars.SafeString(page);

});

module.exports = router;
