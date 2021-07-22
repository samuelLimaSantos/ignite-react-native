import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { 
  Container,
  Header,
  UserInfo,
  Photo,
  UserGreeting,
  UserName,
  User,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {

  const data: DataListProps[] = [{
    id: '1',
    type: 'positive',
    title: "Desenvolvimento de site",
    amount: "R$ 1.259,00",
    category: {
      icon: 'dollar-sign',
      name: 'Vendas'
    },
    date:"13/04/2020"
  },
  {
    id: '2',
    type: 'negative',
    title: "Desenvolvimento de site",
    amount: "R$ 1.259,00",
    category: {
      icon: 'coffee',
      name: 'Vendas'
    },
    date:"13/04/2020"
  },
  {
    id: '3',
    type: 'negative',
    title: "Desenvolvimento de site",
    amount: "R$ 1.259,00",
    category: {
      icon: 'shopping-bag',
      name: 'Vendas'
    },
    date:"13/04/2020"
  }
]

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/63209462?v=4'}} />
            <User>
              <UserGreeting>
                Olá,
              </UserGreeting>
              <UserName>
                Samuel
              </UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={() => {}}>
            <Icon 
              name="power" 
            />
          </LogoutButton>
        </UserWrapper>

      </Header>
      <HighlightCards>
        <HighlightCard 
          title="Entradas" 
          amount="R$ 17.400,00" 
          lastTransaction="Última entrada dia 14 de abril"
          type="up"
        />

        <HighlightCard 
          title="Saídas" 
          amount="R$ 1.259,00" 
          lastTransaction="Última saída dia 03 de abril"
          type="down"
        />

        <HighlightCard 
          title="Total" 
          amount="R$ 16.141,00" 
          lastTransaction="01 à 16 de abril"
          type="total"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>


        <TransactionList 
          data={data}
          renderItem={({item}) => <TransactionCard data={item} />}
          keyExtractor={item => item.id}
        />

      </Transactions>
    </Container>
  )
};

