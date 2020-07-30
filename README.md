# codeLink
Proyecto desarrollado con Angular, NodeJS y MongoDB

## FrontEnd
```sh
$ cd codeLink-app
$ npm install
$ ng serve
```

## BackEnd
```sh
$ cd codeLink-api
$ npm install
$ node index
```

### Comandos Shell Basicos MongoDB
```sh
$ mongo # Iniciar shell mongoDB, se debe ejecutar primero

# db
$ show dbs # Mostrar las dbs
$ use <nombreDB> # Crear/abrir db
$ db # Mostrar db actual
$ db.dropDatabase() # Eliminar db

# colecciones
$ db.createCollection(nombre, opciones) # Crear una nueva coleccion
$ show collections # Mostrar colecciones
$ db.<collectionName>.drop() # Eliminar coleccion

#CRUD
$ db.<collectionName>.insert({}) # Crear
$ db.<collectionName>.find() # Leer
$ db.<collectionName>.update({filtro}, {$set: {}}) # Actualizar
$ db.<collectionName>.remove({filtro}, true|false)
```





