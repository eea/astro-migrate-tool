# Gopher CMS

## Backend

### Technologies

- Web server written in go. Serves as a REST Api facilitating the communication between the frontend and DB
- Data base using scylladb
- Cache using redis
- Frontend written in astrojs

#### Go web server

- Facilitate communication between the frontend and DB
- Defines the structure of the DB
- Needs a license to run
- Can have multiple sites using one node server or multiple node servers
- Can export a site as static html using the node server
- Can rebuild a node server using definitions stored in db for a specific site that runs on that node server

#### Scylladb

#### Redis

#### Frontend

- Can be used as both static (doesn't require a node server to run) or hybrid (require a node server to run)
- Connects to a specific site in the go web server



##### Backend should respond only with updated change if it was cached?