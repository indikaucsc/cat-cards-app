const Jimp = require("jimp");
const axios = require("axios").default;
const logger  = require("./logger");
const CATAPI_BASE_URL = "https://cataas.com/cat";

const PARAMS = {
  width: 400,
  height: 500,
  textColor: "Pink",
  textSize: 100,
};

// get command line arguments
const cmdArgs = process.argv.slice(2);
const greetingText = cmdArgs[0] ? cmdArgs[0] : "Happy birthday!";
const who = cmdArgs[1] ? cmdArgs[1] : "Indika";

// catch any errors
init(cmdArgs).catch((err) => {
  logger.error("Application Error : ",err.message);
});

/**
 * main method
 *
 */
async function init() {

  logger.info(`greetingText : ${greetingText} | who : ${who}`);
  const newImageName = `greeting-card-${new Date().getTime()}.jpg`;   // new image name
  const firstImage = await generateCatImage(greetingText);              // get first random cat image with text
  const secondImage = await generateCatImage(who);                      // get second random cat image with text
  const newImage = await blendImages(firstImage, secondImage);
  await newImage.writeAsync(newImageName);
  logger.info(`Generated cat card to ${newImageName}`);
}

/**
 * call CATAAS api (https://cataas.com/)
 *
 */
async function generateCatImage(text) {
  logger.info(`generateCatImage | text : ${text} | params :`,  PARAMS);
  const response = await axios.get(
    `${CATAPI_BASE_URL}/says/${text}?width=${PARAMS.width}&height=${PARAMS.height}&color=${PARAMS.textColor}&size=${PARAMS.textSize}`,
    {
      responseType: "arraybuffer",
    }
  );
  if (response.data) {
    return Buffer.from(response.data, "binary");
  } else {
    logger.error("CATAAS services Error : ");
    throw error("CATAAS services error");
  }

}

/**
 * blend two given images
 *
 */
async function blendImages(firstImage, secondImage) {
  const leftImg = await Jimp.read(firstImage);
  const rightImg = await Jimp.read(secondImage);
  const container = new Jimp(PARAMS.width * 2, PARAMS.height);
  container.blit(leftImg, 0, 0);
  container.blit(rightImg, rightImg.getWidth(), 0);
  return container;
}
