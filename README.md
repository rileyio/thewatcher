TheWatcher
==========
A client to server monitoring tool (*Keeps watch over its clients through the night for you.*)

[![NPM Version][npm-badge]][npm-url] [![Dependency Status][david-dm-badge]][david-dm-url] [![Code Climate][code-climate-badge]][code-climate-url]
  
---

### # Setup

##### Clone the project

> **Recommendation:** Use the master branch for the best stability,
  If you wish to try an experimental / dev branch checkout be aware, there
  will be errors / incomplete functionality.

```
git clone https://github.com/TheDoxMedia/thewatcher.git
```

##### Get Dependencies

```
npm install
```

---

### # Running / Commands
> All commands starting with `node index.js`

| Desc               | Shorthand     | Full       | Arg / Options           |
|:-------------------|---------------|------------|-------------------------|
| Run Config Builder | `-s`          | `--setup`  |  `client | server`      |
| Start in mode      | `-m`          | `--mode`   |  `client | server`      |


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
