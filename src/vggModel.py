import sys
import os
import numpy as np
from PIL import Image as pil_image
from keras.applications.vgg16 import VGG16, preprocess_input, decode_predictions
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def predictPicture(picturePath):
     mod = VGG16() #Calling VGG16 Model
     img = pil_image.open(picturePath) #loading picture
     img = img.resize((224, 224)) #Resize
     dataimg = np.float64(np.array(img)) #Encode
     dataimg = np.reshape(dataimg,(1,224,224,3)) #Encode
     dataimg = preprocess_input(dataimg) #Encode
     pred = mod.predict(dataimg) #get predicts
     predlabel = decode_predictions(pred) #apply imagenet labels
     predlabel = predlabel[0][0] #get the first prediction
     return(predlabel[1] + "-" + str(predlabel[2]*100)) 

predictedResult = predictPicture(str(sys.argv[1]))
print(predictedResult)