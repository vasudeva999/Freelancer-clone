const monogoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const profile_schema = new monogoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phoneNum: {type: String, default: ""},
    img: {data: Buffer, type: String, default: ""},
    totalBids: {type: Number, default: 6}
})

const about_schema = new monogoose.Schema({
    refId: {type: String, require: true},
    summary: {type: String, default: ""},
    professionalHeadline: {type: String, default: ""},
    HourlyRate: {type: Number, default: 0}
})

const verify_schema = new monogoose.Schema({
    refId: {type: String, require: true},
    isAdmin: {type: Boolean, default: false},
    isPhoneNumVerified: {type: Boolean, default: false},
    isemailVerified: {type: Boolean, default: false},
    isFBConnected: {type: Boolean, default: false}
})

const experience_schema = new monogoose.Schema({
    refId: {type: String, require: true},
    title: {type: String, default: ""},
    company: {type: String, default: ""},
    startDate: {type: Date, default: Date.now()},
    endDate: {type: Date, default: Date.now()}
})

const edu_schema = monogoose.Schema({
    refId: {type: String, require: true},
    country: {type: String, default: ""},
    collage: {type: String, default: ""},
    degree: {type: String, default: ""},
    startYear: {type: Number, default: 0},
    endYear: {type: String, default: ""}
})

const qualify_schema = new monogoose.Schema({
    refId: {type: String, require: true},
    certificate: {type: String, default: ""},
    organization: {type: String, default: ""},
    summary: {type: String, default: ""},
    startYear: {type: Number, default: ""}
})

const pub_schema = new monogoose.Schema({
    refId: {type: String, require: true},
    title: {type: String, default: ""},
    publisher: {type: String, default: ""},
    summary: {type: String, default: ""}
})

const project_schema = new monogoose.Schema({
    refId: {type: String, require: true},
    title: {type: String, require: true},
    describe: {type: String, require: true},
    file: {data: Buffer, type: String, require: true},
    date: {type: Date, require: true},
    skills: {type: [], require: true},
    minPrice: {type: Number, require: true},
    maxPrice: {type: Number, require: true},
    daysToExpire: {type: Number, require: true}

})

const user_schema = new monogoose.Schema({
    refId: {type: String, require: true},
    profile: {type: {}, default: {profile_schema}},
    verifications: {verify_schema},
    about: {about_schema},
    experience: {experience_schema},
    education: {edu_schema},
    qualifications: {qualify_schema},
    publications: {pub_schema},
    projects: {project_schema}
    // topSkills: {type: ArrayType}
    
})

const proposal_schema = new monogoose.Schema({
    userId: {type: String, require: true},
    projectId: {type: String, require: true},
    bidAmount: {type: Number, require: true},
    days: {type: Number, require: true},
    describe: {type: String, require: true}
})

profile_schema.pre('save', async function(){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(2);
        this.password = await bcrypt.hash(this.password, salt);
    }else{
        console.log("Error!")
        return "Failed to bcrypt the password";
    }
})

profile_schema.methods.comparePasswords = async function(password){
    return await bcrypt.compare(password, this.password);
}

profile_schema.methods.getSignedToken = function(){
    return jwt.sign({id: this._id}, 'key')
}


module.exports.Profile = monogoose.model("profile", profile_schema)
module.exports.Verify = monogoose.model("verification", verify_schema)
module.exports.About = monogoose.model("about", about_schema)
module.exports.Experience = monogoose.model("experience", experience_schema)
module.exports.Education = monogoose.model("education", edu_schema)
module.exports.Qualification = monogoose.model("qualifications", qualify_schema)
module.exports.Publications = monogoose.model("publications", pub_schema)
module.exports.PostProject = monogoose.model("postProject", project_schema)
module.exports.Proposal = monogoose.model("Proposal", proposal_schema)

module.exports.User = monogoose.model("freelancerUsers", user_schema);;