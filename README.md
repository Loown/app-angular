## Docker

Run dock

1. Build image 

```bash
docker build . --tag ng-app
```

2. Run container

```bash
docker run --publish 4200:4200 ng-app
```