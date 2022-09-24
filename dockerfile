FROM nikolaik/python-nodejs:latest

WORKDIR /dashboard_app

COPY flask_backend flask_backend

COPY react_frontend react_frontend

WORKDIR /dashboard_app/react_frontend

RUN npm install

RUN npm run build

WORKDIR /dashboard_app/flask_backend

RUN pip3 install --no-cache-dir -r requirements.txt

CMD ["flask", "--app", "flask-app", "--debug", "run", "--host=0.0.0.0"]