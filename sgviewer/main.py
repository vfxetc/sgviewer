import functools
import json
import os

from flask import Flask, request, render_template, redirect, url_for, abort

from sgsession import Session
import shotgun_api3_registry


app = Flask(__name__,
    static_url_path='',
)
app.root_path = os.path.dirname(os.path.dirname(__file__))


def Shotgun():
    return Session(shotgun_api3_registry.connect())


def static(path):
    path = path.strip('/')
    real_path = os.path.join(app.root_path, 'static', path)
    if os.path.exists(real_path):
        return '/%s?mt=%d' % (path, os.path.getmtime(real_path))
    else:
        return '/%s' % path


@app.context_processor
def inject_into_templates():
    return dict(static=static)


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('hello.html')


# Incoming from the Shotgun ActionMenuitem.
@app.route('/action_menu_item', methods=['POST'])
def action_menu_item():
    entity_type = request.form['entity_type'].lower()
    entity_id = request.form['selected_ids'].split(',')[0]
    return redirect(url_for('view_one', entity_type=entity_type, entity_id=entity_id))


@app.route('/latest_version/<entity_type>/<int:entity_id>')
def view_one(entity_type, entity_id):

    entity_type = entity_type.title()
    sg = Shotgun()

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

    return render_template('view_one.html',
        entity=entity,
        video_url=video_url,
    )


def api_endpoint(func):
    @functools.wraps(func)
    def _decorated(*args, **kwargs):
        return json.dumps(func(*args, **kwargs), indent=4, sort_keys=True)
    return _decorated


@app.route('/notes/<entity_type>/<int:entity_id>.json')
@api_endpoint
def note_api(entity_type, entity_id):

    entity_type = entity_type.title()
    sg = Shotgun()

    entity = sg.find_one(entity_type, [('id', 'is', entity_id)], ['notes'])
    if not entity:
        abort(404)

    notes = entity['notes']
    if not notes:
        return []

    fields = ('id', 'type', 'created_by', 'created_at', 'subject', 'content')
    extra = ('created_by.HumanUser.image', )
    sg.fetch(notes, fields + extra)

    results = []
    for note in notes:
        note = dict((k, note[k]) for k in fields)
        note['created_at'] = note['created_at'].isoformat()
        results.append(note)

    return results






