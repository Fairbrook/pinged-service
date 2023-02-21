# Pinged - Servicio

__Autor:__ Kevin Alan Martínez Virgen 219294382

### Introducción
Este servicio busca comprobar si un servidor web está en buen estado, para ello
realiza dos peticiones, una petición http get al la página principal, lo que comprueba 
que el servidor (en este caso apache) siga respondiendo a las solicitudes, y las
segunda petición la hace mediante una conexión a la base de datos.

En caso de que cualquiera de las peticiones termine de forma errónea se genera un 
reporte con la petición que falló y se envía un correo a la direción proporcionada

Esto es muy últil para monitorear el estado de un servidor ya que en algunos casos
puede fallar cualquiera de las dos partes. En este servidor en específico, la base
de datos tendía a ser cerrada ya que no cuenta con mucha memoria.

### Implementación

Para esta práctica utilicé NodeJS por su facilidad de uso y que ya estoy acostumbrado
al ecosistema que proporciona, sin embargo, hubiera sido más realista utilizar un 
lenguaje con menor huella de memoria.

La principal parte de la implementación se podría considerar las peticiones que realiza
el servicio para determinar que la base de datos y el servidor web están funcionando.
Para ello utilice una librería que me hace el trabajo más fácil

```ts
export async function healthCheck () {
  return HealthcheckerDetailedCheck({
    name: 'La Nube méxico',
    version: '1.0',
    integrations: [
      {
        type: HealthTypes.Web,
        name: 'Web',
        host: process.env.WEB_URL
      },
      {
        type: HealthTypes.Database,
        name: 'MySQL Database',
        host: process.env.DATABASE_HOST,
        dbPort: parseInt(process.env.DATABASE_PORT),
        dbName: process.env.DATABASE_NAME,
        dbUser: process.env.DATABASE_USER,
        dbPwd: process.env.DATABASE_PASSWORD,
        dbDialect: Dialects.mysql
      }
    ]
  });
}
```

Una vez terminado el código y habíendolo cargado en el servidor, utilicé un
manejador de procesos (comunmente usado en el entorno de node) llamado pm2
Este programa sería el que me permitiría que (a pesar de no ser un servicio) el
código escrito se comportara como un servicio de forma más sencilla

Para que pm2 pudiera reestableces el entorno incluso despues de un reinicio, el
mismo pm2 se registró como un servicio en el servidor, a continuación podemos ver
el archivo de configuración que utilizó para esto

```
[Unit]                                                                                                    
Description=PM2 process manager                                                                           
Documentation=https://pm2.keymetrics.io/                                                                                                                                                                             
After=network.target                                                                                      
                                                                                                          
[Service]                                                                                                                                                                                                            
Type=forking                                                                                              
User=root                                                                                                 
LimitNOFILE=infinity                                                                                                                                                                                                 
LimitNPROC=infinity                                                                                       
LimitCORE=infinity                                                                                                                                                                                                   
Environment=PATH=/root/.nvm/versions/node/v16.15.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/root/.local/share/kitty-ssh-kitten/kitty/bin:/bin:/usr/loc
al/sbin:/usr/local/bin:/usr/sbin:/usr/bin                                                                                                                                                                            
Environment=PM2_HOME=/root/.pm2                                                                                                                                                                                      
PIDFile=/root/.pm2/pm2.pid                                                                                                                                                                                           
Restart=on-failure                                                                                                                                                                                                   
                                                                                                                                                                                                                     
ExecStart=/root/.nvm/versions/node/v16.15.0/lib/node_modules/pm2/bin/pm2 resurrect                        
ExecReload=/root/.nvm/versions/node/v16.15.0/lib/node_modules/pm2/bin/pm2 reload all                                                                                                                                 
ExecStop=/root/.nvm/versions/node/v16.15.0/lib/node_modules/pm2/bin/pm2 kill                                                                                                                                         
                                                                                                                                                                                                                     
[Install]                                                                                                                                                                                                            
WantedBy=multi-user.target
```
