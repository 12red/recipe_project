import os
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from utils import non_max_suppression, adjust_ratio, idx_to_class
from PIL import Image
from io import BytesIO
import numpy as np
import torch
import torch.nn as nn
import torchvision.transforms as transforms


UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}

app = Flask(__name__)
app.secret_key = 'super secret key'


@app.route('/', methods=['GET'])
def hello():
    return 'Hello World'


app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


transform = transforms.Compose([
    transforms.Resize((640, 640)),
    # transforms.CenterCrop(640),
    transforms.ToTensor(),
    # transforms.Normalize(
    # mean=[0.485, 0.456, 0.406],
    # std=[0.229, 0.224, 0.225]
    # )
])

model = torch.jit.load("assets/yolov5m.torchscript.pt")
model.eval()


@app.route('/uploads', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            # filename = secure_filename(file.filename)
            # f = request.files['file'].read()
            # img = Image.open(request.files['file'].stream)
            img = Image.open(request.files['file'].stream)
            # img =np.array(img)
            x_size = img.size
            img = transform(img)
            img = torch.unsqueeze(img, 0)
            outs = model(img)
            preds = non_max_suppression(outs[0])
            preds_modified = []
            for pred in preds:
                pred_ = pred.numpy().tolist()
                for p in pred_:
                    p[-1] = idx_to_class[str(int(p[-1]))]
                    p.extend(x_size)
                    preds_modified.append(adjust_ratio(p, x_size, 640))
            return jsonify(preds_modified)
