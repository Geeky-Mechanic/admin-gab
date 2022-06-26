import jwt from 'jsonwebtoken' ;

export function verifyToken (token) {;     
        return jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
            if(err){
                return false;
            }else{
                return true;
            }
        });
};