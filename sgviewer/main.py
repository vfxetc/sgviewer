import os

from flask import Flask, request, render_template


app = Flask(__name__)
app.root_path = os.path.dirname(os.path.dirname(__file__))

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('hello.html')
