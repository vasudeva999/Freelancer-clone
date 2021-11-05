const express = require('express');
const bcrypt = require('bcryptjs');
require("dotenv").config()

const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });

const {User, Profile, About, Verify, Experience, Education,
Qualification, Publications, PostProject, Proposal} = require("../model/user");
const jwt = require('jsonwebtoken')

const upload = require("../middleware/upload")
const fs = require("fs")


const router = express.Router();


router.post("/addUser", async (req, res, next)=>{
    const { name, email, password, clientUrl } = req.body

    if (name == null){
        res.send({status: "Name_null", isValid: false, token: null, message: "Name filed was Empty. Enter your userName."})
    }
    else if (email == null){
        res.send({status: "Email_null", isValid: false, token: null, message: "Email filed was Empty. Enter your email."})
    }else if (password == null){
        res.send({status: "password_null", isValid: false, token: null, message: "Password filed was Empty. Enter your password."})
    }else {

        try{
            
            const nameProfile = await Profile.findOne({name: name})
            const emailProfile = await Profile.findOne({email: email})
            if (nameProfile && nameProfile.name){
                res.send({status: "Name_Exists", isValid: false, token: null, message: "User with userName: "+name+" is already exists!"})
            }
            else if (emailProfile && emailProfile.email){
                res.send({status: "Email_Exists", isValid: false, token: null, message: "User with email id: "+email+" is already exists!"})
            }else{

                var mailOptions = {
                    from: process.env.Email,
                    to: email,
                    subject: 'Account Activation Link',
                    html: `
                        <h2>Please click on given link to activate your account</h2>
                        <a href="${clientUrl}/verifyEmail/${name}/${email}/${password}">Activate Account</a>
                    `
                  };
                 
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        res.send({status: "Error", isValid: false, message: error.message})
                    } else {
                        res.send({status: "Success", isValid: true, message: "An Email has been send to the Email id: "+ email})
                    }
                  });
            }
            
        }catch(error){
            res.send({status: "Error", isValid: false, token: null, message: error.message})
        }
    }
})

router.get("/verifyEmail/:name/:email/:password", async (req, res)=>{
    try{
        const nameProfile = await Profile.findOne({name: req.params.name})
        const emailProfile = await Profile.findOne({email: req.params.email})
        if (nameProfile && nameProfile.name){
            res.send({status: "Name_Exists", isValid: false, token: null, message: "User with userName: "+name+" is already exists!"})
        }
        else if (emailProfile && emailProfile.email){
            res.send({status: "Email_Exists", isValid: false, token: null, message: "User with email id: "+email+" is already exists!"})
        }else{
        const profile = await Profile.create({
                name: req.params.name,
                email: req.params.email,
                password: req.params.password
            });
        // await User.create({refId: profile._id, profile: profile})

        res.send({status: "Success", isValid: true, token: profile.getSignedToken(), message: "Account has been created, Please wait!", id: profile._id})
        }
    }catch(error){
        res.send({status: "Error", isValid: false, token: null, message: error.message})
    }
})


router.post("/forgetPassword", async (req, res)=>{
    const { email, clientUrl } = req.body
    try{
        if (email == null || email == ""){
            res.send({status: "Error", isValid: false, message: "Please enter email id"})
        }else{
            const profile = await Profile.findOne({email: email})
            if (profile && profile.email){
                const token = jwt.sign({id: profile._id}, "key", {expiresIn: '10m'})

                var mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Password Reset',
                    html: `
                        <h2>Please click on given link to activate your account</h2>
                        <a href="${clientUrl}/resetPassword/${email}/${token}">Reset Password</a>
                    `
                  };
                 
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        res.send({status: "Error", isValid: false, message: error.message})
                    } else {
                        res.send({status: "Success", isValid: true, message: "An Email has been send to the Email id: "+ email})
                    }
                  });

            }else{
                res.send({status: "Error", isValid: false, message: "user with email id: "+email+" not exists."})
            }
        }
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message, user: null})
    }
})

router.post("/resetPassword/:email", (req, res)=>{
    const token  = req.body.token
    let password = req.body.password
    if (token){
        jwt.verify(token, "key", async function(error){
            if (error){
                res.send({status: "Error", isValid: false, message: "Incorrect token or Token was expired!"})        
            }else{
                const salt = await bcrypt.genSalt(2);
                password = await bcrypt.hash(password, salt);
                await Profile.updateOne({email: req.params.email}, {password: password})
                res.send({status: "Success", isValid: true, message: "Password has been updated!"})
            }
        })
    }else{
        res.send({status: "Error", isValid: false, message: "Authentication error!"})
    }
})

router.post("/dropProfile", async (req, res)=>{
    const email = req.body.email
    
    try{
        const profile = await Profile.findOne({ email: email})

        if (profile && profile.email){
            await Profile.deleteOne({email: email})
            try{
                fs.unlinkSync(profile.img)
            }catch(error){
                console.log(error.message);
            }
            res.send({status: "Error", isValid: true, message: "User deleted!"})
        }else{
            res.send({status: "Error", isValid: false, message: "User with email id: " + email+ " not exists!"})
        }
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message})
    }
})

router.post("/updateProfile/:id", upload.single('file'), async (req, res)=>{
    const {name, email, password, phoneNum, delFile} = req.body
    const file = req.file
    const id = req.params.id

    var obj = {}
    
    if (name){
        obj["name"] = name
    }if (email){
        obj["email"] = email
    }if (password){
        const salt = await bcrypt.genSalt(2);
        obj["password"] = await bcrypt.hash(password, salt);
    }if (phoneNum){
        obj["phoneNum"] = phoneNum
    }if (file != null ){
        obj["img"] = file.path
    }if (delFile == "true"){
        obj["img"] = ""
    }

    try{
        if(delFile == "true" || file){
            let profile = await Profile.findOne({_id: id})
            try{
                fs.unlinkSync(profile.img)
            }catch(error){
            }
        }

        await Profile.findByIdAndUpdate({_id: id}, obj)

        profile = await Profile.findOne({_id: id})

        res.send({status: "Success", isValid: true, message: "Details has been updated!!!", profile: profile})
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message, profile: null})
    }

})

router.get("/getUser/:id", async (req, res)=>{
    try{
        const profile = await Profile.findOne({_id: req.params.id})
        
        if (profile){
            res.send({status: "Success", isValid: true, message: profile})
        }else{
            res.send({status: "Error", isValid: false, message: "User not Exists in DataBase", data: null})
        }
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message, data: null})
    }
})

router.get("/getUserImage/:id", async (req, res)=>{

    try{
        const profile = await Profile.findOne({_id: req.params.id})
        if (profile){
            let item = profile.img
            res.send({status: "Error", isValid: false, message: "Getting Image!", img: item})
        }else{
            res.send({status: "Error", isValid: false, message: "Image not Found!", img: null})
        }
        
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message, img: null})
    }
})

router.post("/auth", async (req, res, next)=>{
    const {id, email, password} = req.body

    try{
        if (id){
            const user = await Profile.findOne({_id: id})
            
            res.send({status: "Success", isValid: true, message: "Logged In. Please wait!", token: user.getSignedToken(), user: user})
        }else{
            
            const user = await Profile.findOne({email: email})
            
            if (user){
                const isValidUser = await user.comparePasswords(password)
                if (isValidUser){
                    res.send({status: "Success", isValid: true, message: "Logged In. Please wait!", token: user.getSignedToken(), user: user})
                }else{
                    res.send({status: "Error", isValid: false, message: "Please enter correct password!", token: null, user: null})
                }
            }else{
                res.send({status: "Error", isValid: false, message: "User with email id: "+email+" not exists! Please enter correct details.\n    or \nCreate new account.", user: null})
            }
        }
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message, user: null})
    }
})

router.post("/postProject/:id", upload.single('file'), async (req, res)=>{
    const { title, describe, skills, minPrice, maxPrice, expire} = req.body
    let file = req.file

    if (!title){
        res.send({status: "title_null", isValid: false, message: "Title filed was Empty. Enter your project name/title."})
    }else if (!describe){
        res.send({status: "description_null", isValid: false, message: "Description filed was Empty. Enter your project description."})
    }else if(!skills){
        res.send({status: "skills_null", isValid: false, message: "Skill field was Empty!. Enter required skills for this project."})
    }else if(!minPrice){
        res.send({status: "minPrice_null", isValid: false, message: "Min Price field was Empty!. Enter minimum price for this project."})
    }else if(!maxPrice){
        res.send({status: "maxPrice_null", isValid: false, message: "Max Price field was Empty!. Enter maximum price for this project."})
    }else if(!expire){
        res.send({status: "expire_null", isValid: false, message: "Expire field was Empty!. Enter expire days for this project."})
    }else{

        try{
            if (file){
                file = file.path
            }else{
                file = "uploads/nofile"
            }
            await PostProject.create({
                refId: req.params.id,
                title: title,
                describe: describe,
                file: file,
                skills: skills.split(","),
                minPrice: minPrice,
                maxPrice: maxPrice,
                daysToExpire: expire,
                date: new Date()
            })
            res.send({status: "Success", isValid: true, message: "Added to database"})
            
        }catch(error){
            res.send({status: "Error", isValid: false, message: error.message})
        }
    }
})

router.post("/updateProject", upload.single('file'), async (req, res)=>{
    const {id, title, describe, skills, minPrice, maxPrice, expire, delFile} = req.body
    const file = req.file

    var obj = {}
    
    if (title){
        obj["title"] = title
    }if (describe){
        obj["describe"] = describe
    }if (skills){
        obj["skills"] = skills
    }if (minPrice){
        obj["minPrice"] = minPrice
    }if (maxPrice){
        obj["maxPrice"] = maxPrice
    }if (expire){
        obj["expire"] = expire
    }if (file){
        obj["file"] = file.path
    }if (delFile == "true"){
        obj["file"] = "uploads/noImage"
    }
    
    try{
        if(delFile == "true" || file){
            let project = await PostProject.findOne({_id: id})
            try{
                fs.unlinkSync(project.file)
            }catch(error){
            }
        }

        await PostProject.updateOne({_id: id}, obj);

        res.send({status: "Success", isValid: true, message: "Detalis has been updated!!!"})        
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message})
    }

})

router.delete("/deleteProject/:id", async (req, res)=>{
    try{
        const project = await PostProject.findOne({_id: req.params.id})
        try{
            fs.unlinkSync(project.file)
        }catch(error){
        }
        await PostProject.deleteOne({_id: req.params.id})
        res.send({status: "Success", isValid: true, message: "Project has been deleted!"})
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message})
    }
    
})

router.post("/getAllProjects", async (req, res)=>{
    const id= req.body.id

    try{
        if (id){
            const myProjects = await PostProject.find({refId: id}).sort({date: -1})
            res.send({status: "Success", isValid: true, message: myProjects})
            
        }else{
            let data = []
            try{
                const allProjects = await PostProject.find().sort({date: -1})
                for(let project of allProjects){
                    let user = await Profile.findOne({_id: project.refId})
                    data.push([project, user])
                }
                    
                res.send({status: "Success", isValid: true, message: data})
            }catch(error){
                res.send({status: "Error", isValid: false, message: error.message})
            }
        }
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message})
    }
})


router.get("/getProject/:id", async (req, res)=>{
    try{
        const project = await PostProject.findOne({_id: req.params.id})
        const user = await Profile.findOne({_id: project.refId})
        res.send({status: "Success", isValid: true, message: [project, user]})
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message})
    }
})

router.post("/makeBid/:id/:userId", async (req, res)=>{
    const { bidAmount, days, describe } = req.body
    try{
        const profile = await Profile.findOne({_id: req.params.userId})
        if (profile.totalBids>0){
            await Proposal.create({
                userId: req.params.userId,
                projectId: req.params.id,
                bidAmount: bidAmount,
                days: days,
                describe: describe
            })
            res.send({status: "success", isValid: true, message: "Added your Bid!"})
            await Profile.updateOne({_id: profile._id}, {totalBids: profile.totalBids-1})
        }else {
            res.send({status: "Error", isValid: false, message: "You don't have enough bid's"})    
        }
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message})
    }
})

router.get("/getProposals/:id", async (req, res)=>{
    try{
        let data = []
        const allProposals = await Proposal.find({projectId: req.params.id})

        for(let proposal of allProposals){
            let user = await Profile.findOne({_id: proposal.userId})
            data.push([proposal, user])
        }
            
        res.send({status: "Success", isValid: true, message: data})
        
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message})
    }
})

router.get("/getFreelancerCount", async (req, res)=>{
    try{
        const usersCount = await Profile.count()
        const projectsCount = await PostProject.count()
        const bidCount = await Proposal.count()

        res.send({status: "Success", isValid: true, message: {usersCount: usersCount, projectsCount: projectsCount, bidCount: bidCount} })
    }catch(error){
        res.send({status: "Error", isValid: false, message: error.message })
    }
})


router.get("**", (req, res)=>{
    res.send("Sorry your are trying to accessing the unknown path :(")
})

module.exports = router