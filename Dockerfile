FROM ubuntu:bionic

ENV LANG C.UTF-8
ARG DEBIAN_FRONTEND=noninteractive
# Allow SECRET_KEY to be passed via arg so collectstatic can run during build time
ARG SECRET_KEY
ARG NODE_ENV
ARG PORT
ARG REACT_APP_HAT_AROOTAH_URL
ARG REACT_APP_HAT_AROOTAH_API_TOKEN
ARG REACT_APP_HAT_AROOTAH_API_BASE_URL
ARG REACT_APP_EMAILJS_SERVICE_ID
ARG REACT_APP_EMAILJS_TEMPLATE_ID
ARG REACT_APP_EMAILJS_SIGNUP_TEMPLATE_ID
ARG REACT_APP_EMAILJS_USER_ID
ARG REACT_APP_GOOGLE_CLIENT_ID


RUN apt-get update
Requirements for nodejs and npm
Install Node.js
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential


# libpq-dev and python3-dev help with psycopg2
RUN apt-get update \
  && apt-get install -y python3.7-dev python3-pip libpq-dev curl nodejs \
  && apt-get clean all \
  && rm -rf /var/lib/apt/lists/*
  # You can add additional steps to the build by appending commands down here using the
  # format `&& <command>`. Remember to add a `\` at the end of LOC 12.
  # WARNING: Changes to this file may cause unexpected behaviors when building the app.
  # Change it at your own risk.

WORKDIR /opt/webapp
COPY . .
RUN npm install && npm run build
RUN pip3 install --no-cache-dir -q 'pipenv==2018.11.26' && pipenv install --deploy --system
RUN python3 manage.py collectstatic --no-input

# Run the image as a non-root user
RUN adduser --disabled-password --gecos "" django
USER django

# Run the web server on port $PORT
CMD waitress-serve --port=$PORT habit_tracker_29377.wsgi:application
