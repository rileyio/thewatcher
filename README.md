NightWatch
==========
A client to server monitoring tool (*Keeps watch over its clients through the night for you.*)

---

### # Setup

##### Clone the project

> **Recommendation:** Use the master branch for the best stability,
  If you wish to try an expiermental / dev branch checkout the version
  branches.

```
git clone git@gitlab.com:tdm/NightWatch.git
```


##### Get Dependencies

```
npm install
```

---

### # Running / Commands
> All commands starting with `node index.js`

 Desc          | Shorthand     | Full       | Arg / Options           |
---------------|-------------------------------------------------------
Starting up    | `-c`          | `--config` | `</path/to/file.json>`
Adding a client| `-a`          | `--add`    | `client`

### # Setting up the server

Create a server.json file and define the port & set the mode.

**Example**

```
{
	"mode": "server",
	"port": 3560
}
```

---

### # Versions

##### 0.0.1
  - Initial release.
    - Readme added!
    - Both Client and Server modes available (set in respective .json config file that's loaded in.)
    - Add and generate of clients can be performed using the `--add` mode of running NightWatch.
    - Checkins & Clients tracked via DB files.
