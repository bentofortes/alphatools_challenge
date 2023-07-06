FROM python:3.10

WORKDIR /app
COPY Pipfile /app
COPY Pipfile.lock /app

RUN pip install pipenv
RUN pipenv install --system

COPY . /app


ENTRYPOINT ["python", "-u", "run.py"]