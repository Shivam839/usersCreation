const express = require("express")
const path = require("path")
const app = express()
const usermodel = require("./Models/user")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))

app.set("view engine", 'ejs')

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/read",async (req,res)=>{
    let usersdata = await usermodel.find()
    res.render("read",{usersdata})

    // res.send(usersdata)
})
app.post("/create", async (req,res)=>{
    let {name,email,imageUrl} = req.body
    let createdUser = await usermodel.create({
        name:name,
        email:email,
        imageUrl:imageUrl
    })
    res.redirect("/read")

})

app.get("/edit/:id", async (req, res) => {
    try {
        const usersdata = await usermodel.findById(req.params.id);
        res.render("edit", { usersdata }); // 'edit' should be the name of the view template
    } catch (error) {
        res.status(500).send("An error occurred while retrieving the user data.");
    }
});

app.post("/edit/:id", async (req, res) => {
    try {
        const { name, email, imageUrl } = req.body;
        await usermodel.updateOne({ _id: req.params.id }, {
            name: name,
            email: email,
            imageUrl: imageUrl
        });

        res.redirect("/read"); // Redirect to the read page after update
    } catch (error) {
        res.status(500).send("An error occurred while updating the user data.");
    }
});


app.get("/delete/:id", async (req,res)=>{
    let deleteduser = await usermodel.deleteOne({
        _id:req.params.id
    })
    res.redirect("/read")
})

app.listen(3000,(err)=>{
    if(err){
        console.log("server failed");
    }
    else{
        console.log("server is connected");
    }
})