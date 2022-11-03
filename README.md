# Flinging - a Phaser 3 physics-based game


## Development

Setup requires:

 - Node.js (e.g. using `nvm`)
 - Python 3
 - `git clone --recurse-submodules git@github.com:DouglasOrr/Flinging.git`

```shell
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Running:

 - `./build --dev`, then visit http://localhost:8000 or http://localhost:8000/?autoreload=true
 - `./build`, for release
 - `npm run check`, unit tests, types and lint
