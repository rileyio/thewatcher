TheWatcher
==========
A client to server monitoring tool (*Keeps watch over its clients through the night for you.*)

[![NPM Version][npm-badge]][npm-url] [![Dependency Status][david-dm-badge]][david-dm-url] [![Code Climate][code-climate-badge]][code-climate-url]

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

---

### # Running via cmd / shell
> All commands starting with `node index.js`

| Desc               | Shorthand     | Full       | Arg / Options            |
|:-------------------|---------------|------------|--------------------------|
| Run Config Builder | `-s`          | `--setup`  |  `client | server`       |
| Start in mode      | `-m`          | `--mode`   |  `client | server`       |
| Add a client       | `-a`          | `--add`    |  `/path/to/json`         |
| Export client conf |               | `--export` |  `client` `/path/to/save`|


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

---


### # Usage via `require('thewatcher')`



---

### # Versions
##### 1.0.0
  - Rebuilding (Current Master/Dev Branches)

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