import { Router, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { NextFunction } from 'connect';
import { config } from './config';


export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if ( !req.headers || !req.headers.authorization ) {
        // return res.status(401).send({message: "No authorization headers"});
        return next()
    }

    const bearer_token = req.headers.authorization.split(' ');
    if ( bearer_token.length != 2 ) {
        return res.status(401).send({message: "Malformed bearer token"});
    }

    const token = bearer_token[1];
    jwt.verify(token, config.jwt.secret, (err, decode)=>{
        if ( err ){
            return res.status(500).send({auth:false, message: "Failed to authenticate"});
        }

        return next();
    });
   
}