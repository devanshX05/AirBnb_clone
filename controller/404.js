const path=require('path');

exports.Notfound=(req,res,next)=>{
    res.status(404);
    res.sendFile(path.join(__dirname,'../views/404.html')); //error path
    user: req.session.user
}

// here __dirname is:MVC/controller