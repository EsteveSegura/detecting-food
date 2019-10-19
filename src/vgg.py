import sys
import os
import numpy as np
from keras.applications.vgg16 import VGG16, preprocess_input, decode_predictions
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def predictPicture(picturePath):
     mod = VGG16()
     from PIL import Image as pil_image
     img = pil_image.open('./' + picturePath)
     img = img.resize((224, 224))
     dataimg = np.float64(np.array(img))
     dataimg = np.reshape(dataimg,(1,224,224,3))
     dataimg = preprocess_input(dataimg)
     pred = mod.predict(dataimg)
     predlabel = decode_predictions(pred)
     predlabel = predlabel[0][0]
     return(predlabel[1] + "-" + str(predlabel[2]*100))

predictedResult = predictPicture(str(sys.argv[1]))
print(predictedResult)