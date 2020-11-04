FROM mcr.microsoft.com/mssql/server:2017-CU18-ubuntu-16.04

ENV ACCEPT_EULA Y
ENV MSSQL_PID Express

ARG SA_PASSWORD="BadDefaultPassword!"
ENV SA_PASSWORD="${SA_PASSWORD}"

ARG MOCK_DATA="F"
ENV MOCK_DATA="${MOCK_DATA}"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN chmod +x /usr/src/app/run-initialization.sh

CMD /bin/bash ./entrypoint.sh