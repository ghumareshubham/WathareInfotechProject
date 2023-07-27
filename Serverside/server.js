import express from "express";
// Express body-parser is an npm module used to  to handle HTTP POST request.
import bodyParser from "body-parser";
//below three imports usefull for sending html file to browser
// const cors = require('cors');
import cors from "cors";

import mongoose from "mongoose";
// import _ from "lodash";

const app = express();
app.use(cors());
app.use(express.json());

//below two app.set is useful for rendering the list.ejs file

app.set("view engine", "ejs");

//below app.use is used for provide style.css file to our dynamic list1.ejs file
app.use(express.static("public"));

// Express body-parser is an npm module used to  to handle HTTP POST request.
app.use(bodyParser.urlencoded({ extended: true }));

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22
// MongoDB connection URL
//db name
const mongoURL = "mongodb://0.0.0.0:27017/studManagement";
// const mongoURL = "mongodb+srv://sghumare789:CBeh4KwVa0gks0aZ@cluster0.ssldc3j.mongodb.net/todolistDB";


// Connect to MongoDB
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB ....");
    // Start your application logic here
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


//creating schema for our collection(table)
const studentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    marks: {
      // Assuming each student has marks for multiple subjects
      // You can define individual properties for each subject
      math: {
        type: Number,
        default: 0,
      },
      science: {
        type: Number,
        default: 0,
      },
      english: {
        type: Number,
        default: 0,
      },
      // Add more subjects as needed
    },
  });
// creating collection with respect to schema
//collectin Name
const Student = mongoose.model('Student', studentSchema);

// Create a new Document to add student in DB
const mystudent1 = new Student({
    name: 'John Doe',
    marks: {
      math: 90,
      science: 85,
      english: 78,
    },
  });
  

const defaultStudent = [mystudent1];

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


app.get('/api/data', async (req, res) => {
  try {
    const students = await Student.find();
    if (students.length === 0) {
      // If no students found, insert default students
      await Student.insertMany(defaultStudent);
      res.json(defaultStudent);
    } else {
      res.json(students);
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// POST endpoint to add a new student
app.post('/api/addStudent', async (req, res) => {
  try {
    const { name, marks } = req.body;
    console.log(req.body);
    const newStudent = new Student({ name, marks });
    const savedStudent = await newStudent.save();
    res.json(savedStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});







app.get('/api/data/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error('Error fetching student data:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});








// app.get("/", function (req, res) {
//   Item.find({})
//     .exec()
//     .then((foundItems) => {
//       //find all the documents inside the Item collection and render them to the list1.ejs

//       if (foundItems.length === 0) {
//         //if no items yet in the collection, then simply add them into the collection ONCE!!!
//         Item.insertMany(defaultItem)
//           .then(function () {
//             console.log("Items Saved Successfully.... ");
//           })
//           .catch(function (err) {
//             console.log("Failed to Add Items" + err);
//           });

//         //if no items then it will create them, after it needs to redirect once again to the homepage and render them
//         //if we wont write the redirect statement it wont execute the else code ever since it executed the if statement first.
//         res.redirect("/");
//       } else {
//         //if already inserted items into the DB then simply render them to the homePage
//         res.render("list1", { listTitle: "Today", newListItems: foundItems }); //passing to the list the foundItems array
//       }
//     })
//     .catch((error) => {
//       //if any error then catch it and print it
//       console.error(error);
//     });
// });


// //@@@@@@@@@@@@@@@CustomList Creation
// app.get("/:customListName",function(req,res){
//   const customListName = _.capitalize(req.params.customListName); // refers to the above url customListName
//   List.findOne({name: customListName}).exec().then((foundList) =>{
//     //console.log(foundList);
//     if(!foundList){ //if not found a document with that name then we want to create this document only once! 
//       const list = new List({
//         name: customListName,
//         items: defaultItem //will get all the items that were declared in the beginning inside that document
//       });
//       list.save();//save into the database
//       res.redirect("/"+customListName);//redirect again to render the list of that particular url 
//     }
//     else{ //if found a document in the List collection with the specified name
//       res.render("list1", {listTitle: foundList.name, newListItems: foundList.items})//title is the name of the list
//       //the items of the list are the items inside the foundList object inside our List colleciton
//     }
//   }).catch((error)=>{
//     console.log(error);
//   });
// });


// //post request to add item
// app.post("/", function (req, res) {
//   const itemName = req.body.newItem;
//   const listName=req.body.list;
//   const newItem=new Item({
//     name:itemName
//   });

//   if(listName==="Today"){// the default Item collection
//     newItem.save();//will save our item into the collection of Item
//     res.redirect("/");//after saving the Item we want to show him once again
//   }
//   else{
//     //trying to add a new item not in the default Today list(home page)
//     //need to find the document in the List collection and add the object into the items array of the List collection
//     //in that way the added objects will be added only to the corresponding web page we are currently in
//     List.findOne({name: listName}).exec().then((foundList) =>{
//       foundList.items.push(newItem);
//       foundList.save();
//       res.redirect("/"+ listName);
//       });
//   }

// });



// //post request to delete item
// app.post("/delete", function (req, res) {
//   const checkItemID = req.body.checkbox; //get the id of that checkbox when pressed. checkbox declared inside list.ejs
//   const listName=req.body.listName;//the hidden input we implemented in list.ejs


//   if(listName==="Today"){
//     Item.findByIdAndRemove({_id: checkItemID}).exec().then((foundItem)=>{
//       console.log("Succesfully removed the item from Items collection");
//     }).catch((error)=>{
//       console.error(error);
//     });
//     res.redirect("/");//need to redirect once again to our home route to render all the items in the database once again
//   }
//   else{
// //if we are deleting anything else other than the homepage then we need to find the corresponding object
//     //inside the array of this document and pull(which means remove) on the basis of ID from List.
//     List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkItemID}}}).exec().then((foundList)=>{
//       res.redirect("/"+ listName);
//     }).catch((error)=>{
//       console.error(error);
//     });


//   }

// });


    



app.listen(5000, function () {
  console.log("Server is running on port 5000....");
});
