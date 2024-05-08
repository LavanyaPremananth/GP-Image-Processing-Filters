// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
    
    text("Down Arrow = negative",10,10);
    text("Up Arrow = radialBlurFilter",10,30);
    text("R = redFilter",10,50);
    text("G = greenFilter",10,70);
    text("B = BlueFilter",10,90);
    
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
   resultImg.copy(imgIn,0,0,imgIn.width,imgIn.height,0,0,imgIn.width,imgIn.height); 
  resultImg = sepiaFilter(resultImg);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}
/////////////////////////////////////////////////////////////////
function convolution(x, y, matrix, matrixSize, img) {
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color as an array
    return [totalRed, totalGreen, totalBlue];
}
/////////////////////////////////////////////////////////////////
function sepiaFilter(img)
{
    img.loadPixels();
    for(var x=0;x<img.width;x++){
        for(var y=0;y<img.height;y++){
                
        //get each pixel rgb value
        var pixelIndex = ((img.width*y)+x)*4;
        var oldRed = img.pixels[pixelIndex+0];
        var oldGreen = img.pixels[pixelIndex+1];
        var oldBlue = img.pixels[pixelIndex+2]
        
        //compute new rgb value
        var newRed = (oldRed*.393) + (oldGreen*.769) + (oldBlue * .189);
        var newGreen = (oldRed*.349) + (oldGreen*.686) + (oldBlue * .168);
        var newBlue = (oldRed*.272) + (oldGreen*.534) + (oldBlue * .131);
        
        //constrain the rgb value to 0 to 255
        newRed = constrain(newRed,0,255);
        newGreen = constrain(newGreen,0,255);
        newBlue =  constrain(newBlue,0,255);
        
        
        //update each pixel with new rgb value
        img.pixels[pixelIndex+0] = newRed;
        img.pixels[pixelIndex+1] = newGreen;
        img.pixels[pixelIndex+2] = newBlue;
        img.pixels[pixelIndex+3] = 255;
    }  
    }
    img.updatePixels();
    return img;
}
/////////////////////////////////////////////////////////////////
function darkCorners(img)
{
    img.loadPixels();
    var midX = img.width/2;
    var midY = img.height/2;
    //calculate the distance from (0,0) to center- the max distance
    var maxDist = abs(dist(midX,midY,0,0))
    var dynlum = 1;
    for(var x=0;x<img.width;x++){
        for(var y =0;y<img.height;y++){
            var d = abs(dist(midX,midY,x,y));
            if(d>300){
            var pixelIndex = ((img.width*y)+x)*4;
            var oldRed = img.pixels[pixelIndex+0];
            var oldGreen = img.pixels[pixelIndex+1];
            var oldBlue = img.pixels[pixelIndex+2];
                
            if(d<=450)
                dynLum = map(d,300,450,1,0.4);
            else
                dynLum = map(d,450,maxDist,0.4,0);
            dynLum = constrain(dynLum,0,1);
            //update each pixel with new rgb value
            img.pixels[pixelIndex+0]= oldRed*dynLum;
            img.pixels[pixelIndex+1]= oldGreen*dynLum;
            img.pixels[pixelIndex+2]= oldBlue*dynLum;   
            }
        }
    }
    img.updatePixels();
    return img;
}
/////////////////////////////////////////////////////////////////
function radialBlurFilter(img)
{
    img.loadPixels();
    
    for(var x=0;x<img.width;x++){
        for(var y =0;y<img.height;y++){
            var pixelIndex = ((img.width*y)+x)*4;
            var oldRed = img.pixels[pixelIndex+0];
            var oldGreen = img.pixels[pixelIndex+1];
            var oldBlue = img.pixels[pixelIndex+2];
            
            //calculate the convolution value for that pixel
            var c = convolution(x,y,matrix,matrix.length,img);
            var mouseDist = abs(dist(x,y,mouseX,mouseY));
            var dynBlur = map(mouseDist,100,300,0,1);
            dynBlur = constrain(dynBlur,0,1);
            
            
            //calculate the new RGB value
            var newRed = c[0]*dynBlur + oldRed *(1-dynBlur);
            var newGreen = c[1]*dynBlur + oldGreen *(1-dynBlur);
            var newBlue = c[2]*dynBlur + oldBlue *(1-dynBlur);
            
            // update each pixel with new rgb value
            img.pixels[pixelIndex+0] = newRed;
            img.pixels[pixelIndex+1] = newGreen;
            img.pixels[pixelIndex+2] = newBlue;
        }
    }
    img.updatePixels();
    return img;
}
/////////////////////////////////////////////////////////////////
function borderFilter(img)
{
    //draw the img onto the buffer
    var bufferImg = createGraphics(img.width,img.height);
    bufferImg.image(img,0,0);
    
    bufferImg.noFill();
    bufferImg.stroke(255);
    bufferImg.strokeWeight(20);
    bufferImg.rect(0,0,img.width,img.height,50)
    
    
    bufferImg.noFill();
    bufferImg.strokeWeight(20);
    bufferImg.stroke(255);
    bufferImg.rect(0,0,img.width,img.height);
    return bufferImg;
}
/////////////////////////////////////////////////////////////////
function greyScale(img)
{
    img.loadPixels();
    for(var x=0;x<img.width;x++)
        {
            for(var y=0;y<img.width;y++)
                {
                    var pixelIndex=((img.width*y)+x)*4;
                    var oldRed=img.pixels[pixelIndex+0]
                    var oldGreen=img.pixels[pixelIndex+1]
                    var oldBlue=img.pixels[pixelIndex+2];
                    //averge of all the three colours are stored in variable grey
                    var grey=(oldRed+oldGreen+oldBlue)/3
              		// red, green and blue to hold the value of variable grey
              		img.pixels[pixelIndex+0]=grey;
              		img.pixels[pixelIndex+1]=grey;
              		img.pixels[pixelIndex+2]=grey;
              		img.pixels[pixelIndex+3]=255;
                    
                }  
        }
   		img.updatePixels();
    	return img;
}

function negative(img)
{
    img.loadPixels();
    
    for(var x=0;x<img.width;x++)
        {
            for(var y=0;y<img.width;y++)
                {
                    var pixelIndex=((img.width*y)+x)*4;
                    var oldRed=img.pixels[pixelIndex+0]
                    var oldGreen=img.pixels[pixelIndex+1]
                    var oldBlue=img.pixels[pixelIndex+2];
              		//subtracting the values of oldRed, oldGreen and oldBlue from white
              		img.pixels[pixelIndex+0]=255-oldRed;
              		img.pixels[pixelIndex+1]=255-oldGreen;
              		img.pixels[pixelIndex+2]=255-oldBlue;
             		img.pixels[pixelIndex+3]=255;
                    
                }  
        }
    	img.updatePixels();
    	return img;
}

function redFilter(img)
{
    img.loadPixels();
    
    for(var x=0;x<img.width;x++)
        {
            for(var y=0;y<img.width;y++)
                {
                    var pixelIndex=((img.width*y)+x)*4;
                    var oldRed=img.pixels[pixelIndex+0];
              		//setting oldRed to its orignal while other holds 0
              		img.pixels[pixelIndex+0]=oldRed;
              		img.pixels[pixelIndex+1]=0;
              		img.pixels[pixelIndex+2]=0;
              		img.pixels[pixelIndex+3]=255;        
                    
                }  
        }
		img.updatePixels();
    	return img;
}

function greenFilter(img)
{
    img.loadPixels();
    
    for(var x=0;x<img.width;x++)
        {
            for(var y=0;y<img.width;y++)
                {
                    var pixelIndex=((img.width*y)+x)*4;
                    var oldGreen=img.pixels[pixelIndex+1]            
              		img.pixels[pixelIndex+0]=0;
              		//setting oldGed to its orignal while other holds 0
              		img.pixels[pixelIndex+1]=oldGreen;
              		img.pixels[pixelIndex+2]=0;
              		img.pixels[pixelIndex+3]=255;        
                    
                }  
        }
    	img.updatePixels();
    	return img;
}

function blueFilter(img)
{
    img.loadPixels();
    
    for(var x=0;x<img.width;x++)
        {
            for(var y=0;y<img.width;y++)
                {
                    var pixelIndex=((img.width*y)+x)*4;
                    var oldBlue=img.pixels[pixelIndex+2];

              		img.pixels[pixelIndex+0]=0;
              		img.pixels[pixelIndex+1]=0;
              		//setting oldBlue to its orignal while other holds 0
              		img.pixels[pixelIndex+2]=oldBlue;
              		img.pixels[pixelIndex+3]=255;          
                }  
        }
    	img.updatePixels();
    	return img;
}


function keyPressed()
{
       
   if (keyCode === DOWN_ARROW) 
    {      
        image(negative(imgIn), imgIn.width, 0);
        preload();
    }
    
	if (keyCode === UP_ARROW) 
    {      
        image(radialBlurFilter(imgIn), imgIn.width, 0);
        preload();
    }
    if (keyCode === 82) //Red
    {      
        image(redFilter(imgIn), imgIn.width, 0);
        preload();
    }
     if (keyCode === 71) //Green
    {      
        image(greenFilter(imgIn), imgIn.width, 0);
        preload();
    }
     if (keyCode === 66) //Blue
    {      
        image(blueFilter(imgIn), imgIn.width, 0);
        preload();
    }

}
