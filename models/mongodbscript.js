var MongoClient = require('mongodb').MongoClient;

var hash = require('object-hash');
 // Connection URL de dick
 var url = "mongodb+srv://dickcasablanca:casablanca2647@cluster0.qftia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//var methods ={addjob,counterjob,updatecounterjob,testmongodbscript};
var methods={};

methods.auth= async function (user)
{

  console.log("rentrée dans auth");
  let flag = false;
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");
  console.log(user);
  let query= {$and:[{"name":user.name },{"password":user.password }]}
  let exist  =  await dbo.collection("users").findOne(query);
  if(exist)
  {
    console.log(exist);
     flag=true;
  }
  else if(exist==null){
    flag=false;
    console.log("not exist");
  }
  client.close();

   return exist;


}
//ADD USER
methods.adduser= async function (user)
{

  console.log("rentrée dans adduser");
  let flag = false;
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");
  console.log(user);
  let query= {$and:[{"name":user.name },{"password":user.password }]}
  let exist   =  await dbo.collection("users").findOne(query);
  if(exist==null)
  {
  let result = await dbo.collection("users").insertOne(user,function(err, res) {
     if (err) throw err;
   });
     flag=true;
  }
  else {
    flag=false;
    console.log("already exist");
  }
  client.close();

   return flag;


}

methods.updateuser = async function (user)
{

let flag=true;
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");

  let query2= {$or:[{"name":user.newname },{"email":user.newemail }]};
  let exist  =  await dbo.collection("users").findOne(query2);
console.log(exist);
  const hashpassword = await hash(user.newpassword)
  console.log(hashpassword)

  console.log("le gars existe");
if( exist==null|| ((user.newname==user.name) ||(user.newemail ==user.email) ))//rajout car beug
{
   query= {$and:[{"name":user.name },{"password":user.password },{"email":user.email }]}

  let result = await dbo.collection("users").updateOne(query,
  {$set: {"name":user.newname,"password":hashpassword,"email":user.newemail}});
  if(user.newadmin!=null && user.newadmin==true)
  {
       console.log("en newadmin");
       result = await dbo.collection("users").updateOne(query,
      {$set: {"isAdmin":1,"isWorker":0}});
      console.log("en admin");
  }
  else if(user.newworker!=null && user.newworker==true)
  {
    console.log("en newworker");
    result = await dbo.collection("users").updateOne(query,
   {$set: {"isAdmin":0,"isWorker":1}});
   console.log("j ai mis en worker");
  }

console.log(result);

}
else {
  flag=false;
}
   client.close();
  return flag;

}

methods.displayusers = async function (currentuser)
{
console.log("entrer pour mongodb");
console.log(currentuser);
let flag=true;
var listusers = [];
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");
  if(currentuser.role=='2') //admin
  {
    console.log("rentrer role 2");
    let useridparse= parseInt(currentuser.userid,10);
  let query= {"id": {$ne:useridparse }};
   listusers   =  await dbo.collection("users").find(query).toArray();
}
else if(currentuser.role=='1') //worker
{
  console.log("rentrer role 1");

  let query= {"isClient":1}
   listusers   =  await dbo.collection("users").find(query).toArray();

}
client.close();

console.log(listusers);
  return listusers;

}


methods.displayprofile = async function (currentuser)
{
console.log("entrer pour mongodb");
console.log(currentuser);

  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");

  let currentparse= parseInt(currentuser.userid,10);
  let query= {"id":currentparse}
  let leuser   =  await dbo.collection("users").findOne(query);

client.close();

console.log(leuser);
  return leuser;

}

methods.deleteuser= async function (user)
{

  console.log("rentrée dans delete");
  let flag = true;
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");
  console.log(user);
  let query= {$and:[{"name":user.name },{"password":user.password }]}
  let result  =  await dbo.collection("users").deleteOne(query);

  client.close();
console.log(result);
   return flag;

}


methods.resetpassword= async function (user)
{

  console.log("rentrée dans reset");
  let flag = true;
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");
  console.log(user);

  const hashpassword = await hash(user.newpassword)
  console.log(hashpassword)

  let query= {"id":parseInt(user.id,10)}
  let result  =  await dbo.collection("users").updateOne(query,
 {$set: {"password": hashpassword}});
  client.close();
console.log(result);
flag=true;
   return flag;

}

methods.finduserbymail= async function (usermail)
{

  console.log("rentrée dans sendmail");
console.log(usermail);
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");

  let query= {"email":usermail.mail};
  let result  =  await dbo.collection("users").findOne(query);
console.log(result);

  client.close();

   return result;

}

methods.displayshops = async function ()
{
console.log("entrer pour mongodb");
let flag=true;
var listshops = [];
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");

   listshops   =  await dbo.collection("shops").find({}).toArray();

client.close();

console.log(listshops);
  return listshops;

}


methods.displayflowers = async function (shopid)
{
console.log("entrer pour mongodb");
console.log(shopid);
let flag=true;
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");
let query = {"id": parseInt(shopid, 10)}
console.log(parseInt(shopid, 10));
  let myshop   =  await dbo.collection("shops").findOne(query);
  console.log(myshop);
let listflowersid = myshop.list_flowers;

query = { "id": { $in: listflowersid } }

let listflower  =  await dbo.collection("flowers").find(query).toArray();



client.close();

console.log(listflower);
  return listflower;

}
methods.addflower = async function (flower,shopid)
{
console.log("entrer pour mongodb");
console.log(shopid);
let flag=true;
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");

  var query = { "name":"counters" };

  let counters =  await dbo.collection("counters").findOne(query);
  let counterflower = counters.flowers_counter;
flower.id=counterflower;

   query = {"id":  parseInt(shopid,10)};
  let myshop   =  await dbo.collection("shops").findOne(query);
  let flowerslist = myshop.list_flowers;
  flowerslist.push(counterflower);
  let  result = await dbo.collection("shops").updateOne( query,
   {$set: { list_flowers: flowerslist}});

result = await updatecounterflower();
 result = await dbo.collection("flowers").insertOne(flower,function(err, res) {
   if (err) throw err;
 });


client.close();

  return true;

}


async function updatecounterflower()
{

  const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });

  var dbo = client.db("FlowersDB");
  var query = { "name":"counters" };

  let counters =  await dbo.collection("counters").findOne(query);
  let counterflower = counters.flowers_counter;
  counterflower=counterflower+1;

  let result = await dbo.collection("counters").updateOne( query,
  {$set: { flowers_counter: counterflower}});


   client.close();
  return true;

}

exports.data = methods;
