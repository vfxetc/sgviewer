import os

from flask import Flask, request, render_template, redirect, url_for, abort

import shotgun_api3_registry


app = Flask(__name__)
app.root_path = os.path.dirname(os.path.dirname(__file__))


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('hello.html')


@app.route('/action_menu_item', methods=['POST'])
def action_menu_item():
    entity_type = request.form['entity_type']
    entity_id = request.form['selected_ids'].split(',')[0]
    return redirect(url_for('view_one', entity_type=entity_type, entity_id=entity_id))


@app.route('/<entity_type>/<int:entity_id>')
def view_one(entity_type, entity_id):

    entity_type = entity_type.title()
    sg = shotgun_api3_registry.connect()

    entity = sg.find_one(entity_type, [('id', 'is', entity_id)], [

        # Version fields:
        'code', 'sg_qt',

        # Shot/Task fields:
        'sg_latest_version.Version.sg_qt',

    ])

    if not entity:
        abort(404)

    video_url_dict = (
        entity.get('sg_qt') or
        entity.get('sg_latest_version.Version.sg_qt')
    ) or {}
    video_url = video_url_dict.get('url')
    if not video_url:
        abort(404)

    return render_template('view_one.html', video_url=video_url)


