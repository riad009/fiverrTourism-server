

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
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
    app.get('/email/findmyproduct', async (req, res) => {

      let query = {};
      if (req.query.email) { //if email have in req->query
        query = {
          ownerEmail: req.query.email //then make filter with email address an make object of email 
        }
      }

      const cursor = estoreCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })



  //delete product from estore
  app.delete('/delete/estore/product/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) }
    const result = await estoreCollection.deleteOne(query)
    res.send(result)

  })
  //update estore product
  app.put('/update/estore/product/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      console.log('id is:', id);
  
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          ownerEmail: user.ownerEmail || undefined,
          name: user.name || undefined,
          Shops: user.Shops || undefined,
          price: user.price || undefined,
          description: user.description || undefined,
          category: user.category || undefined,
          featured: user.featured || undefined,
          stock: user.stock || undefined,
          count: user.count || undefined,
          selectedColors: user.selectedColors || undefined,
          image: user.image || undefined,
        },
      };
  
      // Remove fields with undefined values from the update object
      Object.keys(updatedUser.$set).forEach((key) =>
        updatedUser.$set[key] === undefined ? delete updatedUser.$set[key] : {}
      );
  
      const result = await estoreCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

  //get by feature true
 app.get('/estore/get/featureItem', async (req, res) => {
  const query = { featured: true }; // Update the query to filter by featured=true
  const cursor = estoreCollection.find(query).sort({ _id: -1 }); // Sort by _id field in descending order
  const review = await cursor.toArray();
  res.send(review);
});





//// update stock
   app.put('/update/stock/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const user = req.body;

      const option = { upsert: true }
      const updatedUser = {

        $set: {

          stock: user.stock
        }
      }
      const result = await estoreCollection.updateOne(filter, updatedUser, option)
      res.send(result)
    })
//// update stock

 ////////////////////-- add to card code start----/////////////
 const categoryCollection = client.db('Tourism').collection('category')
  //create category
  //post estore data
  app.post('/post/create/category', async (req, res) => {
    const product = req.body;

    const result = await categoryCollection.insertOne(product);
    res.send(result);
  });

  //get category
  app.get('/get/categoryName', async (req, res) => {
    const query = {};
    const cursor = categoryCollection.find(query);
    const reviews = await cursor.toArray();
  
    const uniqueCategories = {};
    const uniqueReviews = [];
  
    // Iterate through each review
    for (const review of reviews) {
      const category = review.category;
  
      // Check if the category is already added to the uniqueCategories object
      if (!uniqueCategories[category]) {
        // Add the category to uniqueCategories object and add the review to uniqueReviews array
        uniqueCategories[category] = true;
        uniqueReviews.push(review);
      }
    }
  
    res.send(uniqueReviews);
  });
  
  
  
  app.get('/categoryId/:id', async (req, res) => {
    const id = req.params.id;
    const filter={_id: ObjectId(id)}
    const category = await categoryCollection.findOne(filter);
    const query = { category: category.category }; //one taking name from categor colelction another take from estore
    const result = await estoreCollection.find(query).toArray();
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
    app.get('/findUserByEmail', async (req, res) => {

      let query = {};
      if (req.query.email) { //if email have in req->query
        query = {
          email: req.query.email //then make filter with email address an make object of email 
        }
      }

      const cursor = cartcollection.find(query);
      const result = await cursor.toArray();
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
    app.put('/updateUser/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const user = req.body;

      const option = { upsert: true }
      const updatedUser = {

        $set: {

          accountType: user.accountType
        }
      }
      const result = await userCollection.updateOne(filter, updatedUser, option)
      res.send(result)
    })

    //get user by emil
    app.get('/get/findUser/byEmail/', async (req, res) => {

      let query = {};
      if (req.query.email) { //if email have in req->query
        query = {
          email: req.query.email //then make filter with email address an make object of email 
        }
      }

      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
    
    // update user rule
    app.put('/updateUser/accountInfo/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const user = req.body;
    
        const option = { upsert: true };
        const updatedUser = { $set: {} };
    
        if (user.accountType) {
          updatedUser.$set.accountType = user.accountType;
        }
        if (user.shopName) {
          updatedUser.$set.shopName = user.shopName;
        }
        if (user.name) {
          updatedUser.$set.name = user.name;
        }
        if (user.email) {
          updatedUser.$set.email = user.email;
        }
        if (user.emailVerified !== undefined) {
          updatedUser.$set.emailVerified = user.emailVerified;
        }
        if (user.isAnonymous !== undefined) {
          updatedUser.$set.isAnonymous = user.isAnonymous;
        }
    
        // Update the properties directly in the updatedUser.$set object
        if (user.shopName || user.name || user.photo || user.description || user.location || user.phoneNumber) {
          updatedUser.$set.data = {
            shopName: user.shopName,
            name: user.name,
            photo: user.photo,
            description: user.description,
            location: user.location,
            phoneNumber: user.phoneNumber,
          };
        }
    
        const result = await userCollection.updateOne(filter, updatedUser, option);
        res.send(result);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    
  //search user by email
   // product search
   app.get("/user/search/:searchText", async (req, res) => {
    const searchText = req.params.searchText;
    const searchQuery = { email: { $regex: searchText, $options: 'i' } };

    try {
      const productsearch = await userCollection.find(searchQuery).toArray();
      res.send(productsearch);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while searching for product.');
    }
  });
 

  // update- edit user profile
  app.put('/update/user/profile/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      console.log('id is:', id);
  
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name || undefined,
          location: user.location || undefined,
          phoneNumber: user.phoneNumber || undefined,
          profileUrl: user.profileUrl || undefined,
        
        },
      };
  
      // Remove fields with undefined values from the update object
      Object.keys(updatedUser.$set).forEach((key) =>
        updatedUser.$set[key] === undefined ? delete updatedUser.$set[key] : {}
      );
  
      const result = await userCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });




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
    app.put('/update/productStatus/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
    
      const options = { upsert: true };
      const update = {
        $set: {
          'order.$[].card.orderStatus': user.orderStatus, // Update the "name" field
          orderStatus: user.orderStatus, // Update the "orderStatus" field
        },
      };
    
      try {
        const result = await confirmOrderCollection.updateOne(filter, update, options);
        res.send(result);
      } catch (error) {
        res.status(500).send('Error updating order status');
      }
    });
    

  //get all order
  
    //get all product data
    app.get('/get/allOrder', async (req, res) => {
      const query = {}
      const cursor = confirmOrderCollection.find(query);
      const review = await cursor.toArray();
      res.send(review)
    })

    
    //history get complete order
    app.get('/get/history/byemail/', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          "order.card.ownerEmail": req.query.email, // Update the query to ownerEmail
          "order.card.orderStatus": "complete" // Update the query to orderStatus
        };
      }
    
      const cursor = confirmOrderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    
    
    ////////////////////-- tour code start---///////////////
    const tourCollection = client.db('Tourism').collection('Tour')
    //post tour
    app.post('/post/tour', async (req, res) => {
      const product = req.body;
      const result = await tourCollection.insertOne(product);
      res.send(result);
    });

    //get tour by id
    app.get('/get/tour', async (req, res) => {
      const query = {}
      const cursor = tourCollection.find(query);
      const review = await cursor.toArray();
      res.send(review)
    })

    // get tour by id wise
    app.get('/get/tour/id/:id', async (req, res) => {

      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await tourCollection.findOne(query)
      res.send(result)
    })


    //
    //get all tour list
    app.get('/get/alltour/list', async (req, res) => {
      const query = {}
      const cursor = tourCollection.find(query);
      const review = await cursor.toArray();
      res.send(review)
    })

    //delete tour from list
    app.delete('/delete/tour/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await tourCollection.deleteOne(query)
      res.send(result)

    })

   //update tour details
   app.put('/update/tour/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      console.log('id is:', id);
  
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          placeName: user.placeName || undefined,
          sortTrailer: user.sortTrailer || undefined,
          location: user.location || undefined,
          duration: user.duration || undefined,
          price: user.price || undefined,
          description: user.description || undefined,
          dateAndTiming: user.dateAndTiming || undefined,
          availability: user.availability || undefined,
          imageUrl: user.imageUrl || undefined,
  
        },
      };
  
      // Remove fields with undefined values from the update object
      Object.keys(updatedUser.$set).forEach((key) =>
        updatedUser.$set[key] === undefined ? delete updatedUser.$set[key] : {}
      );
  
      const result = await tourCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
 // update get tour by id wise
 app.get('/update/get/tour/id/:id', async (req, res) => {

  const id = req.params.id
  const query = { _id: ObjectId(id) }
  const result = await tourCollection.findOne(query)
  res.send(result)
})


//search tour
app.get("/tour/search/:searchText", async (req, res) => {
  const searchText = req.params.searchText;
  const searchQuery = { placeName: { $regex: searchText, $options: 'i' } };

  try {
    const productsearch = await tourCollection.find(searchQuery).toArray();
    res.send(productsearch);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while searching for product.');
  }
});



    ////////////////////-- tour code start---///////////////
    const bookingTourCollection = client.db('Tourism').collection('Booking')
    //confirm booking
    app.post('/post/tour/booking', async (req, res) => {
      const product = req.body;
      const timestamp = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      product.timestamp = timestamp; // Add timestamp to the product

      const result = await bookingTourCollection.insertOne(product);
      res.send(result);
    });



    //get all booking list
    app.get('/get/findMyBooking/byEmail/', async (req, res) => {

      let query = {};
      if (req.query.email) { //if email have in req->query
        query = {
          email: req.query.email //then make filter with email address an make object of email 
        }
      }

      const cursor = bookingTourCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    //get all booking list
    app.get('/get/allbooking/list', async (req, res) => {
      const query = {}
      const cursor = bookingTourCollection.find(query);
      const review = await cursor.toArray();
      res.send(review)
    })

    //get booking list by id
    app.get('/get/bookingList/id/:id', async (req, res) => {

      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await bookingTourCollection.findOne(query)
      res.send(result)
    })

       //delete booking from list
       app.delete('/delete/bookingList/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await bookingTourCollection.deleteOne(query)
        res.send(result)
  
      })

      //update booking rule
      // update user rule
    app.put('/update/booking/clearance/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const user = req.body;

      const option = { upsert: true }
      const updatedUser = {

        $set: {

          clearance: user.clearance
        }
      }
      const result = await bookingTourCollection.updateOne(filter, updatedUser, option)
      res.send(result)
    })
 

    /////////////////-- comment code-------------///////////
    const commentCollection = client.db('Tourism').collection('comment')


    //post comment and rating
    app.post('/post/comment', async (req, res) => {
      const users = req.body;
      const timestamp = new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'long'
      });
      const commentWithTimestamp = { ...users, timestamp };
    
      const result = await commentCollection.insertOne(commentWithTimestamp);
      res.send(result);
    });
    

     //get comment
     app.get('/get/comment', async (req, res) => {
      const query = {}
      const cursor = commentCollection.find(query);
      const review = await cursor.toArray();
      res.send(review)
    })

    // delete comment
    app.delete('/delete/comment/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await commentCollection.deleteOne(query)
      res.send(result)

    })
    
   //////////////////////////////////////Email send///////////////////
   app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
  
    // Create a transporter with your email provider details
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Reachoutpro.ai@gmail.com',
        pass: 'lkxwcgriuiaqowtd',
      },
    });
  
    // Compose the email
    const mailOptions = {
      from: `${email}`,
      to: 'recipient@example.com', // Replace with the recipient's email address
      subject: 'New Contact Form Submission',
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ message: 'Email sent successfully' });
      }
    });
  });
  


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


