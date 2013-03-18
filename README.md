Shotgun Version Viewer
======================

Installation
------------

    $ virtualenv --no-site-packages venv
    $ . venv/bin/activate
    $ pip install -r requirements.txt


Deploying Changes in WesternX
-----------------------------
    
    $ ssh sg03
    $ cd /www/sgviewer/
    $ sudo git pull --ff-only

    # To load the server processes:
    $ sudo kill -HUP $(cat gunicorn.pid)

    # To completely restart the server (this doesn't bring down gunicorn
    # nicely; find out why):
    $ sudo supervisorctl restart sgviewer
