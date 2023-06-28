

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



require('dotenv').config()
const app = express();
const port = process.env.port || 5000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iueezo8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



app.use(cors());
app.use(express.json());



async function run() {

  try {

    //**********************--CRUD OPERATION START--******************///


    ////////////////--Visit places code START --///////////////////
    const placeCollections = client.db('shabaaz').collection('places')


    //post places data
    app.post('/place/post', async (req, res) => {

      const place = req.body;
      const result = await placeCollections.insertOne(place)
      res.send(result)
    })


    //get all places data
    app.get('/place/get', async (req, res) => {
      const query = {}
      const cursor = placeCollections.find(query);
      const review = await cursor.toArray();
      res.send(review)
    })

    // get place by id wise
    app.get('/placeid/:id', async (req, res) => {

      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await placeCollections.findOne(query)
      res.send(result)
    })




    // //get by catagories wise
    // app.get('/title/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: ObjectId(id) }
    //   const category = await bikeCollection.findOne(filter);
    //   const query = { category: category.category };
    //   const result = await allCollection.find(query).toArray();
    //   res.send(result);
    // })

    // //  //get by catagories  chatgpt wise
    // app.get('/place/get/catagoriesWise', async (req, res) => {
    //   const query = {}
    //   const cursor = placeCollections.find(query);
    //   const reviews = await cursor.toArray();

    //   // Create an object to store categorized reviews
    //   const categorizedReviews = {};

    //   // Iterate over each review
    //   reviews.forEach(review => {
    //     const placeType = review.placeType;

    //     // Check if the placeType already exists as a category
    //     if (categorizedReviews.hasOwnProperty(placeType)) {
    //       categorizedReviews[placeType].push(review);
    //     } else {
    //       // Create a new category and add the review
    //       categorizedReviews[placeType] = [review];
    //     }
    //   });

    //   res.send(categorizedReviews);
    //   console.log('categorizedReviews', categorizedReviews)
    // });


    //get data based on user selected places
    app.get('/place/getByCategory/:category', async (req, res) => {
      const category = req.params.category;
      const query = { placeType: category };
      const cursor = placeCollections.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });


    //------------- Visit places code END-------------------//

    ////////////////--EStore  code Start--///////////////////
    const estoreCollection = client.db('Tourism').collection('estore')


    //post estore data
    app.post('/estore/post', async (req, res) => {
      const product = req.body;
      product.price = parseInt(product.price); // Convert the price to an integer

      const result = await estoreCollection.insertOne(product);
      res.send(result);
    });

    //get all product data
    app.get('/estore/getall', async (req, res) => {
      const query = {}
      const cursor = estoreCollection.find(query);
      const review = await cursor.toArray();
      res.send(review)
    })

    // get product by id wise
    app.get('/estoreid/:id', async (req, res) => {

      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await estoreCollection.findOne(query)
      res.send(result)
    })


    //filter by price and catagories
    app.get('/estore/getProduct/:price/:category', async (req, res) => {
      const price = parseInt(req.params.price); // Convert price to an integer
      const category = req.params.category;

      try {
        const query = { price: { $lte: price }, category: category };
        const products = await estoreCollection.find(query).sort({ price: -1 }).toArray();

        res.send(products);
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      }
    });

    //filter by price only
    app.get('/estore/filterprice/:price', async (req, res) => {
      const price = parseInt(req.params.price); // Convert price to an integer
    
      try {
        const query = { price: { $lte: price } };
        const products = await estoreCollection.find(query).sort({ price: -1 }).toArray();
    
        res.send(products);
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      }
    });

    // product search
    app.get("/estore/search/:searchText", async (req, res) => {
      const searchText = req.params.searchText;
      const searchQuery = { name: { $regex: searchText, $options: 'i' } };

      try {
        const productsearch = await estoreCollection.find(searchQuery).toArray();
        res.send(productsearch);
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while searching for product.');
      }
    });


    // ..load product based on its catagoires
    app.get('/estore/getproductCatagories/:category', async (req, res) => {
      const category = req.params.category;
      console.log('Received category:', category);

      const query = { category: category };
      const cursor = estoreCollection.find(query);
      const products = await cursor.toArray();

      res.send(products);
    });
  

     //find my product by id
     app.get('/email/findmyproduct', async (req,res)=>{
        
      let query ={};
      if(req.query.email){ //if email have in req->query
        query={
          ownerEmail: req.query.email //then make filter with email address an make object of email 
        }
      }

      const cursor= estoreCollection.find(query);
      const result= await cursor.toArray();
      res.send(result);
    })

    



    ////////////////////-- add to card code start----/////////////
    const cartcollection = client.db('Tourism').collection('cart')

    // post product --to the card
   app.post('/order/card/post', async (req, res) => {
      const product = req.body;
    
      const result = await cartcollection.insertOne(product);
      res.send(result);
    });

    //get card info
    app.get('/findUserByEmail', async (req,res)=>{
        
      let query ={};
      if(req.query.email){ //if email have in req->query
        query={
          email: req.query.email //then make filter with email address an make object of email 
        }
      }

      const cursor= cartcollection.find(query);
      const result= await cursor.toArray();
      res.send(result);
    })
     
       //delete my product
       app.delete('/delete/cart/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await cartcollection.deleteOne(query)
        res.send(result)
  
      })
   
  
    ////////////////////-- user db code start----/////////////
    const userCollection = client.db('Tourism').collection('users')
   
    
    app.post('/post/users', async (req, res) => {

      const users = req.body;
      const result = await userCollection.insertOne(users)
      res.send(result)
    })

    //get all users
    app.get('/get/user', async (req, res) => {
      const query = {}
      const cursor = userCollection.find(query);
      const review = await cursor.toArray();
      res.send(review)
    })

     // update user rule
     app.put('/updateUser/:id', async(req,res)=>{
      const id=req.params.id;
      const filter={_id: ObjectId(id)}
      const user= req.body;
      
      const option= {upsert: true}
      const updatedUser={
      
        $set: {
         
          accountType: user.accountType
        }
      }
      const result= await userCollection.updateOne(filter,updatedUser,option)
      res.send(result)
      })

    

      

    ////////////////////// ---- order confirm code start---////////////////
    
    const confirmOrderCollection = client.db('Tourism').collection('orders')
    //post order
    app.post('/order/post', async (req, res) => {
      const product = req.body;
    
      // Add local month and time to the product object
      const currentDate = new Date();
      const month = currentDate.toLocaleString('en-US', { month: 'long' });
      const time = currentDate.toLocaleTimeString('en-US', { timeStyle: 'short' });
      product.time = `${month} ${time}`;
    
      const result = await confirmOrderCollection.insertOne(product);
      res.send(result);
    });
    

    //get my order 
    app.get('/findOrderByEmail', async (req, res) => {
      let query = {};
    
      if (req.query.email) {
        query = {
          $or: [
            { email: req.query.email },
            { "order.card.ownerEmail": req.query.email }
          ]
        };
      }
    
      const cursor = confirmOrderCollection.find(query);
      const result = await cursor.toArray();
    
      if (result.length === 0) {
        res.send('No orders found');
      } else {
        res.send(result);
      }
    });
    

    
    //get order item by id
    // get product by id wise
    app.get('/get/idWise/order/:id', async (req, res) => {

      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await confirmOrderCollection.findOne(query)
      res.send(result)
    })

     // update product status
     app.put('/update/productStatus/:id', async(req,res)=>{
      const id=req.params.id;
      const filter={_id: ObjectId(id)}
      const user= req.body;
      
      const option= {upsert: true}
      const updatedUser={
      
        $set: {
         
          orderStatus: user.orderStatus
        }
      }
      const result= await confirmOrderCollection.updateOne(filter,updatedUser,option)
      res.send(result)
      })


    





    /////////////////////////////--  template code for CRUD operation --///////////////////////////////
    const taskCollection = client.db('task').collection('mytask')

    //task get
    app.get('/mytask', async (req, res) => {
      const query = {}
      const cursor = taskCollection.find(query);
      const review = await cursor.toArray();
      res.send(review)
    })


    app.post('/addtask', async (req, res) => {

      const bike = req.body;
      const result = await taskCollection.insertOne(bike)
      res.send(result)
    })

    //delete my product
    app.delete('/deletetask/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await taskCollection.deleteOne(query)
      res.send(result)

    })


    // update
    app.get('/user/:id', async (req, res) => {

      const id = req.params.id
      const query = { _id: ObjectID(id) }
      const result = await commentCollection.findOne(query)
      res.send(result)
    })





  }
  finally {

  }

}
run().catch(err => console.log(err));








app.get('/', (req, res) => {
  res.send('hello  seven')
})

app.listen(port, () => {

  console.log(`'connect port',${port}`)
})


