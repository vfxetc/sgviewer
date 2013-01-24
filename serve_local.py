import os
from sgviewer.main import app

app.run(debug=True, host='', port=int(os.environ.get('PORT', 8000)))

