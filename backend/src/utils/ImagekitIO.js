// SDK initialization

import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

// let imagekit = new ImageKit({
//   publicKey: "public_uhKXaOEzyluchh2CZ/tcdQI2Ld4=",
//   privateKey: "private_M8SdK3/gJqqxRJf9hR9GN8MAumg=",
//   urlEndpoint: "https://ik.imagekit.io/mernDeveloper",
// });
let imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLICKEY,
  privateKey: process.env.IMAGEKIT_PRIVATEKEY,
  urlEndpoint: process.env.IMAGEKIT_URLENDPOINT,
});

export default imagekit;
