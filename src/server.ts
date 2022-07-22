import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { requireAuth } from './auth';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", requireAuth, async (req, res) => {
    const image_url = req.query.image_url

    if ( !image_url ){
      return res.status(400).send({message: "Invalid image_url parameter provided. "+ image_url})
    }

    let filtered_image_path: string
    try {
    filtered_image_path = await filterImageFromURL(image_url)
    } catch(err) {
      res.status(400).send({message: "Unable to process image: " + err})
    }
    console.log(filtered_image_path)

    await res.sendFile(filtered_image_path, (err) => {
      if ( err ){
        console.log("Error occured while returning the image.")
        res.status(400).end();
      } else {
        console.log("Sent file successfully.")
      }
    });
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();