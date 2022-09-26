FROM node:18.9.0

WORKDIR /dashboard_app/react_frontend

COPY react_frontend/package*.json .

RUN npm install

COPY react_frontend .

RUN npm run build

FROM python:3.10.7

ENV APP_USER=insight

# create the app user
RUN addgroup $APP_USER && adduser --ingroup $APP_USER $APP_USER

# create the appropriate directories
ENV HOME=/home/$APP_USER
ENV APP_HOME=$HOME/dashboard_app
WORKDIR $APP_HOME/flask_backend

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ENV VIRTUAL_ENV=$APP_HOME/flask_backend/venv

RUN python -m venv $VIRTUAL_ENV

ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY flask_backend/requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY --from=0 /dashboard_app/react_frontend/build $APP_HOME/react_frontend/build

COPY flask_backend .

# chown all the files to the app user
RUN chown -R $APP_USER:$APP_USER $APP_HOME

# change to the app user
USER $APP_USER

CMD ["gunicorn", "flask-app:create_app()"]