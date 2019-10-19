import keras
from keras.applications.vgg16 import VGG16
import tensorflowjs as tfjs
model = VGG16(include_top=True, weights='imagenet')
#model.save("VGG16.h5")
tfjs.converters.save_keras_model(model,'./model')