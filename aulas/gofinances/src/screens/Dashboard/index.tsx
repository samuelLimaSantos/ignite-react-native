import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

interface HighlightProps {
  amount: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensive: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {

  const [ data, setData ] = useState<DataListProps[]>([]);
  const [ highlightData, setHighlightData ] = useState<HighlightData>({
    entries: { amount: 'R$ 00,00' },
    expensive: { amount: 'R$ 00,00' },
    total: { amount: 'R$ 00,00' }
  } as HighlightData);

  async function loadTransactions() {
    
    try {
      const dataKey = '@gofinances:transactions';
      const data = await AsyncStorage.getItem(dataKey);
      const transactions = data ? JSON.parse(data) : [];

      let entriesTotal = 0;
      let expensiveTotal = 0;

      const transactionsFormatted: DataListProps[] = transactions.map((transaction: DataListProps) => {

        if (transaction.type === 'positive') {
          entriesTotal += Number(transaction.amount);
        } else {
          expensiveTotal += Number(transaction.amount);
        }

        const amount = Number(transaction.amount).toLocaleString('pt-br',{
          style: 'currency',
          currency: 'BRL',
        });

        const date = Intl.DateTimeFormat('ptBR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format( new Date(transaction.date) );

        return {
          id: transaction.id,
          name: transaction.name,
          amount, 
          date,
          type: transaction.type,
          category: transaction.category,
        };

      });

      const total = entriesTotal - expensiveTotal;

      setData(transactionsFormatted);
      setHighlightData({
        entries: {
          amount: entriesTotal.toLocaleString('pt-br',{
            style: 'currency',
            currency: 'BRL',
          })
        },
        expensive: {
          amount: expensiveTotal.toLocaleString('pt-br',{
            style: 'currency',
            currency: 'BRL',
          })
        },
        total: {
          amount: total.toLocaleString('pt-br',{
            style: 'currency',
            currency: 'BRL',
          })
        }
      })

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

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
          amount={highlightData.entries.amount} 
          lastTransaction="Última entrada dia 14 de abril"
          type="up"
        />

        <HighlightCard 
          title="Saídas" 
          amount={highlightData.expensive.amount}
          lastTransaction="Última saída dia 03 de abril"
          type="down"
        />

        <HighlightCard 
          title="Total" 
          amount={highlightData.total.amount} 
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

