use `brew install python@3.9`
use 

```python
rm -rf venv
python3.9 -m venv venv
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

run `source venv/bin/activate`
run `pip install -r requirements.txt`
run `gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 -b 192.168.68.50:5003 run:app --certfile=/Users/julienchapron/Documents/RESEAU_MESH_ESP32/app/flask-backend/certs/cert.pem --keyfile=/Users/julienchapron/Documents/RESEAU_MESH_ESP32/app/flask-backend/certs/key.pem`