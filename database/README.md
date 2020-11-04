This readme contains information on how to build the database for the 2fa test app

# Note
This database be default contains one record in the users table.  The username is 'admin@default.local' and the password is 'password'.

# Docker Container

## Building the Docker image
You must either build a docker image or import one before you can create containers.

1. Open a terminal and change directories to tbc/Database/
2. Run the following command.  Note the . at the end of the command. ```docker build -t {tag name} .```
    * Example: ```docker build -t 2fa_db .```

## Exporting the Docker image
If you build a docker image and want to transfer it to another machine you can export it to a file.  This makes deployment easier because you do not need to download and compile the source code on the production servers.

1. Follow the instructions to build the docker image
2. Save the image to a .tar file ```docker save -o {filename} {image name}```
    * Example: ```docker save -o 2fa_db.tar 2fa_db```
3. Now you can transfer the tar file to another docker host and import it instead of building a new image

## Importing the Docker image
1. Follow the instructions to export a docker image
2. Make sure docker is installed on the machine where you want to run the image
3. Copy the image to the new server
4. Import the image ```docker load -i {path to tar file}```

## Running with docker compose
See the Util/DockerCompose folder.  This is the prefered way to run the application as a whole.

## Creating a new docker container instance
This container can be run standalone if docker compose is not an option for any reason.

Note: When a new container is created it waits 30 seconds then creates the database.  This gives SQL a chance to startup before it tries to create the db.  It does mean you need to wait at least 30 seconds before trying to connect.

1. Run one of the following commands to create and start a new container depending on your needs.
    * Create new container in forground.  Delete it when it's stopped and lose all changes to db.
        * ```docker run -it --rm -e SA_PASSWORD={password} -p 1433:1433 {image name}```
        * Example: ```docker run -it --rm -e SA_PASSWORD="BadDefaultPassword!" -p 1433:1433 2fa_db```
    * Create a new container in the background that can be started and stopped with persistant data
        * ```docker run -itd --name {container instance name} -e SA_PASSWORD={password} -p 1433:1433 -v {data_volume}:/var/opt/mssql/data -v {log_volume}:/var/opt/mssql/log -v {secrets_volume}:/var/opt/mssql/secrets {image name}```
        * Example: ```docker run -itd --name tbc_mssql -e SA_PASSWORD="BadDefaultPassword" -p 1433:1433 -v mssql_data/var/opt/mssql/data -v mssql_log:/var/opt/mssql/log -v mssql_secrets:/var/opt/mssql/secrets 2fa_db```
    * Interact with a background container
        * show all started or stopped containers
            * ```docker container ls -a```
        * view logs from a background container
            * ```docker logs {container name}```
        * start a stopped container
            * ```docker container start {container name}```
        * stop a running container
            * ```docker container stop {container name}```
        * delete a stopped container
            * ```docker container rm {container name}```

    * View and delete docker volumes
        * list all volumes
            * ```docker volume ls```
        * delete a volume (you will lose all data in the volume)
            * ```docker volume rm {volume name}```
        * delete all volumes that are not currently in use by a container
            * ```docker volume prune```
        * default docker volume location on host
            * Linux: ```/var/lib/docker/volumes/```
            * Windows: ```c:\users\public\documents\hyper-v\virtual hard disks```