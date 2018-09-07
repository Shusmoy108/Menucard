var orderedfood=[];
function orderplus(food_name,food_size,food_price){
    var food={
        food_name: food_name,
        food_size:food_size,
        food_price:food_price
    }
    console.log(food);
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