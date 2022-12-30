

const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { ObjectID } = require('bson');
// const { ObjectId } = require('bson');


require ('dotenv').config()
const app=express();
const port=process.env.port || 5000;

// atlast copy paste code start 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iueezo8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// atlast copy paste code end
//midleware

app.use(cors());
app.use(express.json());
 
// db connect start

// const uri="";

// const client = new MongoClient(uri);

async function run(){

try{
   
const reviewCollection=client.db('dbReview').collection('review')

//task code start..




const taskCollection=client.db('task').collection('mytask')

//task get
app.get('/mytask',async(req,res)=>{
    const query={}
    const cursor = taskCollection.find(query);
    const review= await cursor.toArray();
    res.send(review)
      })



      app.post('/addtask',async (req,res)=>{

        const bike=req.body;
        const result= await taskCollection.insertOne(bike)
        res.send(result)
      })

//task code edn...................................


//assingment 12  start .................................................
//..............................................................
const bikeCollection=client.db('bike').collection('category')
const allCollection=client.db('bike').collection('all')
const bookingCollection=client.db('bike').collection('booking')
const userCollection=client.db('bike').collection('user')
 //get bike
 app.get('/bike',async(req,res)=>{
  const query={}
  const cursor = bikeCollection.find(query);
  const review= await cursor.limit(3).toArray();
  res.send(review)
    })
    // 

    //booking bike
    app.post('/booking', async(req,res)=>{
    const booking = req.body
    console.log(booking)
    const result = await bookingCollection.insertOne(booking)
     res.send(result)


    })


    //get my booking
    app.get('/mybooking', async (req,res)=>{
        
      let query ={};
      if(req.query.email){ //if email have in req->query
        query={
          email: req.query.email //then make filter with email address an make object of email 
        }
      }



      const cursor=bookingCollection.find(query);
      const result= await cursor.toArray();
      res.send(result);
    })

    //get end my booking

    //match seller or buyer account
    app.get('/accountType', async (req,res)=>{
        
      let query ={};
      if(req.query.email){ //if email have in req->query
        query={
          email: req.query.email //then make filter with email address an make object of email 
        }
      }



      const cursor= userCollection.find(query);
      const result= await cursor.toArray();
      res.send(result);
    })

    //match seller or buyer account


//get bike by categories

app.get('/title/:id', async (req, res) => {
  const id = req.params.id;
  const filter={_id: ObjectId(id)}
  const category = await bikeCollection.findOne(filter);
  const query = { category: category.category };
  const result = await allCollection.find(query).toArray();
  res.send(result);
})


//add bike categoires

app.post('/addProduct',async (req,res)=>{

  const bike=req.body;
  const result= await allCollection.insertOne(bike)
  res.send(result)
})

 //get my product
 app.get('/myProduct', async (req,res)=>{
        
  let query ={};
  if(req.query.email){ //if email have in req->query
    query={
      email: req.query.email //then make filter with email address an make object of email 
    }
  }



  const cursor=allCollection.find(query);
  const result= await cursor.toArray();
  res.send(result);
})



//delete my product
app.delete('/deleteProduct/:id',async (req,res)=>{
  const id=req.params.id;
const query ={_id: ObjectId(id)}
const result =await allCollection.deleteOne(query)
res.send(result)


  })
//delete all seller
app.delete('/deleteSeller/:id',async (req,res)=>{
  const id=req.params.id;
const query ={_id: ObjectId(id)}
const result =await userCollection.deleteOne(query)
res.send(result)


  })
//delete all user
app.delete('/deleteUser/:id',async (req,res)=>{
  const id=req.params.id;
const query ={_id: ObjectId(id)}
const result =await userCollection.deleteOne(query)
res.send(result)


  })

  //get function
  //get function
app.get('/jwt',async(req,res)=>{
const email= req.query.email;

const query= {email: email}
const user=await userCollection.findOne(query)
if(user ){
  const token= jwt.sign({email},process.env.ACCESS_TOKEN,{expiresIn: '72h' })
  return res.send({accessToekn: token})
}
console.log(user)
res.send({accessToekn: ''})


})


  // user

    app.post('/user', async(req,res)=>{
      const booking = req.body
      console.log(booking)
      const result = await userCollection.insertOne(booking)
       res.send(result)
  
  
      })


//assing 12 code end
// ////////




 




      //update
// app.get('/user/:id',async(req,res)=>{

//   const id=req.params.id
//   const query={_id: ObjectID(id)}
//   const result= await commentCollection.findOne(query)
//   res.send(result)
// })

// //put update
// app.put('/user/:id', async(req,res)=>{
// const id=req.params.id;
// const filter={_id: ObjectID(id)}
// const user= req.body;

// const option= {upsert: true}
// const updatedUser={

//   $set: {
//     review: user.review
//   }
// }
// const result= await commentCollection.updateOne(filter,updatedUser,option)
// res.send(result)
// })

 

}
finally{

}

}
run().catch(err=>console.log(err));








app.get('/',(req,res)=>{
    res.send('hello6  from mongo')
})

app.listen(port,()=>{

    console.log(`'connect port',${port}`)
})


