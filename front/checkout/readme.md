
# Template checkout

Esse template serve para auxiliar no desenvolvimento e manutencão ao checkout da VTEX. Através dele é possível centralizar, organizar, facilitar e agilizar todo desenvolvimento em torno do checkout.



## Instalação

Instale o projeto com npm e com o node na versão 12.

```bash
  cd checkout
  npm i
```
    
## Como rodar o projeto

Para desenvolver

```bash
  npm run dev
```

Para deploys

```bash
  npm run prod
```

Os arquivos são enviados para a pasta dist


## Como desenvolver

Para desenvolver, será necessário o uso de um interceptador como o Request Interceptopr ou Code Injector (no checkout ui o Code Injector performa melhor)

- Obtenha a rota do arquivo JS ou CSS dentro do checkout da loja (https://prnt.sc/lkOz7k0gftKb)
- Redirecione para o servidor local 
- Configure o redirecionamento https://prnt.sc/spRNEs4DzkK6

Pronto, agora o seu arquivo está sendo direcionado para a loja. Sem a necessidade de ficar salvando e colando o arquivo dentro da VTEX, ganhando agilidade no desenvolvimento.


## Possíveis erros

- Instalar com yarn ou com node na versão superior ao 12.
- o gulpfile há um tratamento de nome do arquivo dist do css. O webpack.common, trata o javascript. Nesses arquivos é capturado o nome do vendor através do manifest. Então, a depender do template, o manifest estará em um lugar diferente e dará erro. Então, é necessário direcionar corretamente para o manifest.
