FROM node:18.9.0

WORKDIR /dashboard_app/react_frontend

COPY react_frontend .

RUN npm install

RUN npm run build

FROM python:3.10.7

WORKDIR /dashboard_app/flask_backend

ENV VIRTUAL_ENV=/dashboard_app/flask_backend/venv

RUN python -m venv $VIRTUAL_ENV

ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY flask_backend .

RUN pip install --no-cache-dir -r requirements.txt

COPY --from=0 /dashboard_app/react_frontend/build /dashboard_app/react_frontend/build

CMD ["gunicorn", "flask-app:create_app()"]