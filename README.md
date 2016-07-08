# ![Cow Websites](src/main/webapp/img/banner-cow.jpg)

Web applications boilerplate

Cow é um boilerplate de arquivos e ferramentas para se ter de forma ágil a versão inicial de uma aplicação web rodando, utilizando um pipeline moderno de desenvolvimento.

```bash
git clone https://github.com/fpinatti/cow.git app
cd app
npm install
npm start
```

Features | Ferramentas usadas
------ | -----
**CSS** | [Sass](http://sass-lang.com/) ([gulp-sass](https://www.npmjs.com/package/gulp-sass)), [Autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer), [Clean Css](https://www.npmjs.com/package/clean-css), [CSS Lint](https://www.npmjs.com/package/csslint), [SCSS Lint](https://www.npmjs.com/package/gulp-scss-lint), [Source maps](https://www.npmjs.com/package/gulp-sourcemaps)
**JavaScript** | [ESLint](https://github.com/adametry/gulp-eslint),[Minify](https://www.npmjs.com/package/gulp-minify),
**HTML** | [Useref](https://www.npmjs.com/package/gulp-useref), [Handlebars](https://www.npmjs.com/package/gulp-compile-handlebars)
**Images** | Compression with [image](https://www.npmjs.com/package/gulp-image)
**Icons** | Auto-generated [Font awesome](http://fontawesome.io/)
**Fonts** | Folder for including WebFonts
**Mocked server** | Stubby [Stubby](https://github.com/mrak/stubby4node)
**Live Updating** | [BrowserSync](http://www.browsersync.io/)
**Screenshots** | [Pageres](https://github.com/sindresorhus/pageres)

## Pré-Requisitos
Caso não tenha, instale o [Node](https://nodejs.org/en/download/).

#### Install Dependencies
```bash
npm install
```

Para continuar um projeto baseado nesse boilerplate, apague a pasta GIT e divirta-se!


#### Run development tasks:
```
npm run build
```

Esta é a única tarefa existente no projeto, a fim de trazer simplicidade e clareza ao pipeline. Rodando a task acima, você tem acesso a um modelo funcional da aplicação, acessando http://localhost:8000.

#### Reinstalando a pasta node_modules
Caso tenha algum problema instalando os pacotes, você pode remover a pasta node_modules e reinstalá-los com o comando npm install. Caso tenha problemas com nomes de arquivos muito longos, utilize o package rimraf.

```bash
npm install -g rimraf
rimraf ./node_modules
```

## Configuração
Configurações estão distribuídas nos arquivos package.json e gulpfile.js.

O `package.json`, além das informações tradicionais, tem um campo chamado `info`, que contém informações gerais do site que serão compiladas pelo Handlebars, como título do site, descrição, tags para facebook/twitter, etc. Você pode adicionar novos parâmetros, e mapeá-los na task "handlebars" do `Gulpfile.js`.

`Gulpfile.js` tem algumas configurações de pastas de entrada/saida, bem como todas as configurações das tarefas. O intuito de manter num arquivo só foi manter a simplicidade para edição, mas cabe a análise se vale a pena dividí-lo em módulos menores.

## Properties
Ao inicializar, a aplicação faz um request para o json properties.json, que contém variáveis utilizadas por todo o site, como chaves de aplicativos (de redes sociais ou outros), urls base, etc. A intenção desse arquivo é que em um ambiente de CI, possamos ter diferentes arquivos de properties para seus respectivos ambientes.

## PUB/SUB
Plugin que implementa o pattern de PubSub (https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)

É extensamente usado nesse boilerplate a fim de trafegar notificações entre os diversos módulos da aplicação.

```javascript
Exemplo de uso:

PubSub.publish( 'MY TOPIC', 'hello world!' );

var mySubscriber = function( msg, data ){
    console.log( msg, data );
};
PubSub.subscribe( 'MY TOPIC', mySubscriber );

PubSub.unsubscribe('MY TOPIC');
```

## SERVER DE MOCK
Essa funcionalidade é útil para aplicações que tem integraçoes com serviços de backend, onde os mesmos podem ter sua representação mockada, a fim de podermos desenvolver antes mesmo dos serviços finais estarem prontos.

O componente usado [Stubby](https://github.com/mrak/stubby4node) permite a representação desses endpoints REST, aceitando diversas configurações e customizações.

Para acessar a aplicação usando os serviços mockados, acesse através da porta 8001

```
http://localhost:8001/ -> todos os serviços são invocados do json de endpoints do Stubby
http://localhost:8010/ -> lista todos os endpoints registrados
```


## Detalhes dos assets
Um arquivo `README.md` com detalhes sobre cada tipo de asset está disponível em cada subdiretório da pasta `src`:

- [JavaScript](src/main/webapp/js/)
- [Folha de Estilos](src/main/webapp/scss)
- [HTML](src/main/webapp/html)
- [Fontes](src/main/webapp/fonts)
- [Imagens](src/main/webapp/img)
- [Arquivos root](src/main/webapp/2root)

## Notas sobre compilação do HTML
É usado Handlebars para compilação dos arquivos html, proporcionando sistema de templates, variáveis, etc.

## Notas sobre compilação do JS
É usado Useref para concatenação dos js, sistema esse que permite declararmos explicitamente quais js desejamos concatenar. No fim do processo, caso o nome do arquivo minificado NÃO contenha a string "vendor", o mesmo é minificado.

```bash
Ex:
nome_do_arquivo.js -> será minificado
vendor_nome_do_arquivo.js -> não será minificado
```

A mesma nomenclatura serve para os arquivos js individuais. Caso tenha o prefixo "vendor", o mesmo será ignorado das validações do eslint.

## Notas sobre compilação do CSS
É usado Sass como base dos arquivos css. Você notará na pasta src/main/webapp/scss duas pastas. Cada pasta dessa dá saída a um arquivo de distribuição `css_nomepasta_min.css`.

A intenção dos nomes das subpastas é organizar o código por funções distintas. Common trata de arquivos para import de fontes, normalização, mixins, etc. A pasta site é propriamente para a estilização de todos os elementos visuais do site. Assim como podem ser criadas outras pastas para uma maior fragmentação. O import desses css estao localizados no partial src/main/webapp/html/partials/head

Note que em cada pasta, há um arquivo main.scss e possíveis arquivos .css. A compilação lê o arquivo main.scss e faz todos os seus imports, e em seguida, concatena o resultado a junção de todos os arquivos .css.

Note que o csslint só é passado nos arquivos .scss.


## Captura de Evidências (screenshots)
O package Pageres é utilizado para capturar urls da aplicação, em resoluções específicas, e as imagens são salvas na pasta /screenshots.

A configuração das urls e demais parâmetros estão no arquivo Gulpfile.js, na task pageres.


## Changes from 1.0
-
-
