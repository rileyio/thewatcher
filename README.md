TheWatcher
==========

A client / server monitoring tool (*Previously named: NightWatch; Keeps watch over its clients through the night*)

[![NPM Version][npm-badge]][npm-url] [![Dependency Status][david-dm-badge]][david-dm-url] [![Code Climate][code-climate-badge]][code-climate-url] [![Gitter][gitter-badge]][gitter-url]

[![js-standard-style][js-standard-badge]][js-standard-url]


---

### # Setup

##### Clone the project

> **Recommendation:** Use the master branch for the best stability,
  If you wish to try an experimental / dev branch checkout be aware, there
  will be errors / incomplete functionality.

```bash
# Installing the latest from NPM
npm install thewatcher

# Optionally installing to access globally
npm install thewatcher -g

# To get the latest on GitHub
git clone https://github.com/TheDoxMedia/thewatcher.git
```

##### Get Dependencies

```
npm install
```

##### First use walkthrough

> Where the command/step should be performed for each step will be marked like: `[server]` 

1. `[server]` A server is needed, on the server machine run `thewatcher -s server`, the
prompts will walk through setting up the Database & server information/keys which will
be located under `./conf`.

2. `[server]` Preparing the Database structure, run `thewatcher --db setup`, this will load
the server.json, connect to the provided DB & table and setup the structure (if not already
present).  (Note: The DB Table must exist & at least be empty for this step)

  >`[server]` At this point the server can be started using `thewatcher -m server`

3. `[client]` Setup a client. The same as with the server, we need to run the client setup to
create the proper .json & client keys. On the client machine, run `thewatcher -s client`
to begin the prompts.

4. `[client]` After completing 3, the client must be loaded into the server's clients database
in order for the client to authenticate and transmit its status/stats. Run `thewatcher --export client /path/to/save.json`

 > **Why not import the default client.json?** The default `/conf/client.json` only contains
 paths to the client's keys. Running the export places the keys into the one exported
 `client.json` file for easy transport/server add/import.

5. `[server]` Adding the new client we created to the server's clients. On the server
run `thewatcher -a /path/to/client.json` pointing to the `client.json` we brought over
from the client machine containing the keys.

 That's it.  For new clients, they only need to be created and added to the server.

6. (Optional) `[server]` You can navigate to `https://127.0.0.1:9905/admin`, once here
provide the server's private key (`./conf/SVR_PrivateKey`) to perform a client-like socket
authentication and display all connected client's and admins along with the currently
available clients stats.

Side note: The client can be created on the server machine, `client.json` exported and
moved to the client machine - the config-loader will understand if it sees the raw key
instead of a path when running for either the server or client mode startup.


---

### # Running via cmd / shell
> All commands starting with `node index.js`

| Desc               | Shorthand     | Full       | Arg / Options            |
|:-------------------|---------------|------------|--------------------------|
| Run Config Builder | `-s`          | `--setup`  |  `client | server`       |
| Start in mode      | `-m`          | `--mode`   |  `client | server`       |
| Add a client       | `-a`          | `--add`    |  `/path/to/json`         |
| Export client conf |               | `--export` |  `client` `/path/to/save`|
| Database *         |               | `--db`     |  `*<check opts below>`   |


#### Config builder

Running config builder mode via command line will prompt the user
for various items such as Name, Location of server, port to listen on, and
database connection information.

```bash
# Example for setting up server
thewatcher -s server

# For client
thewatcher -s client
```


#### Start in mode

Starts TheWatcher in the specified mode, the application will
check the default location (`./conf/`) for the client -or- server's {config}.json
and generated pgp keys. Once loaded the application begin listening or connect to
the specified server and emit back (client to server) its current running details
& stats.

```bash
# Example
thewatcher -m server
```


#### Add a client

Adds the supplied client's configuration & [Public] pgp key to the server's Database.
The server's Database is used to track and authenticate its clients.

```bash
# Example (Note: Without the type, this is contained in the {type}.json file)
thewatcher -a /path/to/client.json
```


#### Export client config

Exports the current client config (from `./conf/client.json`) to the specified
save path.

> **Note**: The default `/conf/client.json` does not store the client's pgp keys
rather it stores the location of the keys and on mode startup these paths are
used to load the client key's data. Exporting replaces the paths with the key
contents for better portability and for importing later at the server.

```bash
# Example
thewatcher --export /path/to/save/
```

#### Database

Helpers to setup and manage the database.

> **Note**: The default `/conf/server.json` is needed in order for these helpers
to setup & communicate with the database (as the server's DB credentials are stored
inside this config file.

```bash
# Example - Migrate the initial DB structure (createTableIfNotExists)
thewatcher --db setup
```


---


### # Usage via `require('thewatcher')`



---

### # Versions
##### 1.0.1
  - Memory DB for storing heartbeat/client current data.
  - MySQL (See docs for supported) DB for storing clients.
  - Database migrations.
  - Better Client & Server config generate.
  - PGP keys on client used to help verify data sent to server.
  - Client config & key exporting.
  - Redone client authentication.
  - Better command line support & options.
  - Available via npm.
  - WebSocket for client <=> server data vs restful from 0.0.1.
  - Some initial support/testin for thewatcher-gui. (More to come)
  - Rename from NightWatch to TheWatcher.
  - More complete readme & walkthrough.
        
##### 1.0.0
  - Used for rebuilding and prep for full release. See >=1.0.1.

##### 0.0.1
  - Initial release.
    - Readme added!
    - Both Client and Server modes available (set in respective .json config file that's loaded in.)
    - Add and generate of clients can be performed using the `--add` mode of running thewatcher.
    - Checkins & Clients tracked via DB files.

[npm-url]: https://www.npmjs.com/package/thewatcher
[npm-badge]: https://img.shields.io/npm/v/thewatcher.svg?style=flat-square
[code-climate-url]: https://codeclimate.com/github/TheDoxMedia/thewatcher
[code-climate-badge]: https://img.shields.io/codeclimate/github/TheDoxMedia/thewatcher.svg?style=flat-square
[david-dm-url]: https://david-dm.org/thedoxmedia/thewatcher
[david-dm-badge]: https://img.shields.io/david/TheDoxMedia/thewatcher.svg?style=flat-square
[js-standard-badge]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[js-standard-url]: https://github.com/feross/standard
[gitter-badge]: https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square
[gitter-url]: https://gitter.im/TheDoxMedia/thewatcher