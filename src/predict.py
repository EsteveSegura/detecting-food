import os
import numpy as np
from keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from keras.models import Sequential, load_model
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

img_width, img_height = 150, 150
model_path = './models/model.h5'
model_weights_path = './models/weights.h5'
model = load_model(model_path)
model.load_weights(model_weights_path)


def predict(file):
    x = load_img(file, target_size=(img_width,img_height))
    x = img_to_array(x)
    x = np.expand_dims(x, axis=0)
    array = model.predict(x)
    print(array)
    result = array[0]
    answer = np.argmax(result)
    if answer == 0:
        print("Label: Elephant")
    elif answer == 1:
        print("Labels: Tiger")
    
    return answer

predict('./test.jpg')