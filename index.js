//// server FINAL basic run (2=>get and post )

const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

// reviewCollection.insertMany([{name: "riad", height:"7.6", cgpa: "green"}]);
app.post("/review",async (req,res)=>{
  const result= await reviewCollection.insertOne(req.body)
res.send(result)
})

 //get
 app.get('/review',async(req,res)=>{
    const query={}
    const cursor = reviewCollection.find(query);
    const review= await cursor.toArray();
    res.send(review)
      })
 

}
finally{

}

}
run().catch(err=>console.log(err));






// db connect end

app.get('/',(req,res)=>{
    res.send('hello90  from mongo')
})

app.listen(port,()=>{

    console.log(`'connect port',${port}`)
})


// server basic run