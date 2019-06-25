
const authenticate = async(req,res)=>{

   try{   
    if(req.cookies.user === undefined || req.cookies.logedIn === undefined)
    
  {  res.render('index'); 
  console.log("Access denied") 
  
} 
else if(req.cookies.admin !=undefined){
    res.render('admin')
    console.log("Admin cannot access user account")
}
else 
   {   
        res.render('accountSettings');
        
     }
    }catch(err){
        if (err){res.render('error')};
    }    
}

const doChanges = async (req, res) =>{
  if(req.cookies.user === undefined || req.cookies.logedIn === undefined){
        res.redirect('/signIn'); 
      
} 
if(req.cookies.admin != undefined){
    res.render('admin')
    }
else {
    if (req.params.action == 'changeSettings'){

       let userId = req.cookies.user;
                try{
              const db = req.app.locals.db;        
           let credentials =  await db.collection('users').findOne(
               {"about":userId},
                {"userEmail": 1, "_id": 0, "userName":0,"password":1, "about":0 }
               )
               
            let usEmail = credentials.userEmail;
            let usPassword = credentials.password;
            res.render('changeSettings', {usEmail, usPassword, mistakes:[]});           
            return;
             }
             catch(err){
                if (err){res.render('error')}
        }   
  }        
    
        if(req.params.action = "myRecords"){
            if(req.cookies.user === undefined || req.cookies.logedIn === undefined){
                res.redirect('/signIn'); 
              
        } 
        if(req.cookies.admin != undefined){
            res.redirect('/admin')
                    }
        else
            let userId = req.cookies.user;
            try{
                const db = req.app.locals.db; 
                let userObject = await db.collection('users').findOne({'about':userId},{'_id':1, 'username':0, 'userEmail':0, 'password':0});
                var user = userObject._id;
                let usName=userObject.userName;
                let allRecords =  await db.collection('pictures').find({'user': usName}, { '_id': 0,'picture': 1, 'score': 1 }).toArray(function(err,doc){
                res.render('myRecords',{allRecords:doc});                
              
            })}catch(e){
                console.log(e);
             };            
 } 
}
}

const saveNewEmail = async(req,res)=>{ 
let oldEmail = req.body.oldEmail
let newEmail = req.body.newEm;
let usEmail = oldEmail
    try{
        const db = req.app.locals.db; 
     let duplicateEmail =    await db.collection('users').findOne({'userEmail':newEmail});
     if(duplicateEmail==null){
      await db.collection('users').updateOne({'userEmail': oldEmail }, {$set: {'userEmail': newEmail} });         
      await db.collection('cookies').updateOne({'userEmail': oldEmail}, {$set:{'userEmail': newEmail}});  
     }else{
         res.render('changeSettings', {usEmail, mistakes:['This  email is already being used']});
         return;
     }
       }catch(err){
        if (err){res.render('error')}
       }
     res.render('accountSettings')
     return;
}

    module.exports={
        authenticate,
        doChanges,
        saveNewEmail,
           
    }