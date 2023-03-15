docker compose run root /bin/sh -c "npm i"

docker compose up -d --force-recreate

docker compose exec root /bin/bash

docker compose down