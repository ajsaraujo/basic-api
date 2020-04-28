## basic-api 

basic-api é uma API feita em Node.js com Express e MongoDB. Ela implementa um CRUD de usuários, além de endpoints para autenticação e recuperação de senha. Foram escritos testes unitários e integrados para todos os endpoints, middlewares e helpers. A intenção é ser um projeto generalista e coeso que sirva como alicerce para aplicações maiores. 

### Instalação e uso 

1. Instale o [Node.js e o NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) na sua máquina se ainda não os tiver.
2. Você precisará de conexão com um banco de dados MongoDB, podendo ser [local](https://zellwk.com/blog/local-mongodb/) ou [remota](https://www.mongodb.com/cloud/atlas).
3. Clone o projeto com ``git clone https://github.com/ajsaraujo/basic-api.git``.
4. Na pasta raiz do projeto, execute o comando ``npm install`` para instalar todas as dependências.
5. Também na pasta raiz crie um arquivo `.env` e adicione todos os campos que estão em `.env.example`, preenchendo da forma que preferir. 
6. Para que a aplicação possa enviar os emails de recuperação de conta, lembre-se de permitir o acesso ao email que você forneceu no `.env`. Caso seu provedor seja o gmail, você pode permitir o acesso clicando [aqui](https://myaccount.google.com/), e depois indo em Proteger conta -> Acesso de terceiros -> Ativar. 
