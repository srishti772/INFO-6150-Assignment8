const User = require("../model/user");
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');

var emailPattern = /([\w\.-]+)@northeastern\.edu$/;
var passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
var namePattern = /^[a-zA-Z\s]+$/;


async function hashPassword(password){
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        return hashedPassword;
    }
    catch(error){
        console.log("error while hashing password "+error);
    throw error;}
    
}

module.exports = (app) => {

app.get('/',(req,res)=>{
    res.send("");
})

    app.post('/user/create', async (req, res) => {
        try {
            const { fullName, email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
     

            const errors = [];

            if (!emailPattern.test(email)) {
                errors.push('Use a valid northeastern email address');
            }

            if (fullName.length < 2) {
                errors.push('First name must be at least 2 characters long');
            }

            if (!namePattern.test(fullName)) {
                errors.push('Invalid characters in name');
            }

            if (!passwordPattern.test(password)) {
                errors.push('Password must be 8 to 10 characters long with 1 uppercase letter, number, and special character');
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const hashedPassword=await hashPassword(password);
            

            // Create a new user
            const newUser = new User({
                fullName,
                email,
                password:hashedPassword,
            });

            // Save the user in the database
            const val = await newUser.save();
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });


    app.put('/user/edit/:email', async (req, res) => {
       
            let update_email=req.params.email;
            let update_name=req.body.fullName;
            let update_password=req.body.password;
            
            console.log('inside put');

                        
            const errors = [];

            //validate fullname and email address
            if (update_name.length < 2) {
                errors.push('First name must be at least 2 characters long');
            }

            if (!namePattern.test(update_name)) {
                errors.push('Invalid characters in name');
            }

            if (!passwordPattern.test(update_password)) {
                errors.push('Password must be 8 to 10 characters long with 1 uppercase letter, number, and special character');
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const hashedPassword=await hashPassword(update_password);
           

           try{ const updatedUser = await User.findOneAndUpdate(
                { email: update_email },
                { $set: { fullName: update_name, password: hashedPassword} },
                { new: true }
            );
        
            if (!updatedUser) {
                return res.status(400).json({ message: 'User not found' });}

                res.status(201).json({message: 'User updated successfully'});
            }
           
         catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }

     

    });


    app.get("/user/getAll",async (req,res)=>{
        try{
            const users=await User.find().exec();
            if(!users || users.length===0){
                return res.status(404).json({ message:"No users found in the database"});
            }
            const formattedUsers = users.map((user) => ({
                fullName: user.fullName,
                email: user.email,
                password: user.password,
            }));

            res.json(formattedUsers);
        }
        catch(err){
            console.log(err);
            res.status(404).json({ message:"Internal Server error"});
        }
        
    })
    

app.delete('/user/delete/:email',async (req,res)=>{
    let deleteEmail=req.params.email;

    try{ const deletedUser=await User.findOneAndDelete(
        ({ email: deleteEmail }));
 
        if(!deletedUser){
         return res.status(404).send({message:"User not found"});
        }
        else return res.status(200).send({message:"User deleted successfully : "+deletedUser.fullName});}


        catch(error){
            console.error(error);
            res.status(404).json({message:"Internal Server Error"});
        }
   

})


app.get('/', function (req, res) {
    res.send('Hello, world'); 
});



}
