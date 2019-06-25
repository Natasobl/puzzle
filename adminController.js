let mongodb = require('mongodb');

const authenticate = async (req,res)=>{
    try{   
        if( req.cookies.admin === undefined)        
      {  res.render('index'); 
    }    else 
       {   
            res.render('admin');            
         }
        }catch(err){
            if (err){res.render('error')};
        }    
}


const getInfo = async(req,res)=>{
    if(req.cookies.admin === undefined){
        res.redirect('/signIn');       
}

else{
    if(req.params.id==="users"){
        try{
            const db = req.app.locals.db; 
            let users = await db.collection('users').find({'role':'0'}).toArray((err,data)=>{
                res.render('users',{users:data});   
            });
           }catch(err){
               if (err){console.log(err)}
           }    
    }
    if(req.params.id==="reports"){
        try{
        const db = req.app.locals.db; 
        let reports = await db.collection('reports').find().toArray((err,data)=>{
            res.render('reports',{reports:data});   
        });
       }catch(err){
           if (err){console.log(err)}
       }
}}
}


const deleteReport = async(req,res)=>{
    try{ 
        const db = req.app.locals.db; 
        await db.collection('reports').deleteOne({'_id':  new mongodb.ObjectID(req.params.id)});
        let reports = await db.collection('reports').find().toArray((err,data)=>{
            res.render('reports',{reports:data});   
        });
            
    }catch(err){
        res.render("error")
    }
}




module.exports={
    authenticate,
   getInfo,
   deleteReport
     }