# Conceitos importantes

- O FlatList é o component mais indicado quando precisamos trabalhar com listas. 
Isso ocorre pois ele lida com as listas de forma mais performática, renderizando os itens 
de acordo com a rolagem da mesma. 

A estrutura do component é: 

```js

const data = [{id: 1, name: 'Samuel'}, {id: 2, name: 'Márcio' }];

<FlatList
  data={data}
  keyExtractor={item => item.id}
  renderItem={({item}) => <Text>item.name</Text>}
/>
```

- Por ser um component React Native, você pode manipular e estilizar a sua 
StatusBar de maneira individual em cada página. 

- Quando se tem um projeto que foi iniciado com o React tradicional e por algum motivo 
sente-se a necessidade de evoluir para o Typescript, é possível fazer isso de maneira muito simples. 
Basta apenas adicionar as dependências, configurar o tsconfig.json, e pronto. 

  * Detalhe: você pode ir refatorando um arquivo por vez, não é necessário que a refatoração seja toda feita
  de uma vez só. 

- O print do código no log de erro, vai ser referente ao primeiro momento na qual o erro estoura, independentemente
daquilo de fato ser onde o erro está localizado.

