# Containerized Development Environment

## Local MongoDB container
One servive called `mongodb`. This service uses the mongo image and specifies a container name of mongodb. The restart property is set to always, which means that the container will always be restarted if it stops for any reason.

The ports property maps port 27017 from the container to the same port on the host machine. This allows external applications to connect to the MongoDB instance running inside the container.

The volumes property specifies a bind mount that maps the `~/mongo-data` directory on the host machine to the `/data/db` directory inside the container. This allows data to persist between container restarts and ensures that data is not lost if the container is deleted.

To run `docker-compose up -d` with the `docker-compose.yml` file located in the `infra` folder, follow these steps:

1. Open a terminal in the root directory of your project.
2. Navigate to the `infra` folder using the command `cd infra`.
3. Run the command `docker-compose up -d` to start the containers.

## Usage with MongoDB Compass

To connect to the MongoDB instance running inside the container, you can use a MongoDB client such as Compass. Here's how you can connect to the MongoDB instance using Compass:

1. Install Compass on your machine if you haven't already.
2. Open Compass and click on the "New Connection" button.
3. In the "New Connection" dialog, enter the following information:
   - **Hostname:** `localhost`
   - **Port:** `27017`
   - **Authentication:** None
4. Click on the "Connect" button to connect to the MongoDB instance.

Once you're connected to the MongoDB instance, you can create databases and collections as needed.