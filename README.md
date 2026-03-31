# GuidelisterFrontend

Interface web de l'application GuideLister, une appli de listing de guides touristiques

## Usage
### Serveur de développement
Avec npm/ng :

```bash
ng serve
```

L'application est accessible via `http://localhost:4200/`.

Le backend doit tourner sur `http://localhost:8080/` (configuré dans `/src/proxy.conf.json`)


### Building

Pour build le projet

```bash
ng build
```

Le résultat sera accessible dans `dist/`. A déployer dans un serveur web type apache/nginx/etc...


