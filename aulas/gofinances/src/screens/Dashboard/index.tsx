import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'styled-components';
import { ActivityIndicator } from 'react-native';
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
  LogoutButton,
  LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensive: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {

  const theme = useTheme();
  const [ isLoading, setIsLoading ] = useState(true);
  const [ data, setData ] = useState<DataListProps[]>([]);
  const [ highlightData, setHighlightData ] = useState<HighlightData>({
    entries: { amount: 'R$ 00,00' },
    expensive: { amount: 'R$ 00,00' },
    total: { amount: 'R$ 00,00' }
  } as HighlightData);

  function getLastDate(transactions: DataListProps[], type: 'positive' | 'negative') {
    const filteredDates = transactions
      .filter(transaction => transaction.type === type)
      .map(transaction => new Date(transaction.date).getTime());
    
    const lastDate = Intl.DateTimeFormat('ptBR', {
      day: '2-digit',
      month: 'long',
    }).format( new Date(Math.max.apply(Math, filteredDates)) );

    return lastDate;
  }

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

      
      setData(transactionsFormatted);

      const lastTransactionEntries = getLastDate(transactions, 'positive');
      const lastTransactionExpensive = getLastDate(transactions, 'negative');
      const totalInterval = `01 à ${lastTransactionExpensive}`; 

      const total = entriesTotal - expensiveTotal;


      setHighlightData({
        entries: {
          amount: entriesTotal.toLocaleString('pt-br',{
            style: 'currency',
            currency: 'BRL',
          }),
          lastTransaction: lastTransactionEntries,
        },
        expensive: {
          amount: expensiveTotal.toLocaleString('pt-br',{
            style: 'currency',
            currency: 'BRL',
          }),
          lastTransaction: lastTransactionExpensive,
        },
        total: {
          amount: total.toLocaleString('pt-br',{
            style: 'currency',
            currency: 'BRL',
          }),
          lastTransaction: totalInterval,
        }
      })

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTransactions();
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      <ActivityIndicator />
      { isLoading ? 
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>  
        : (
        <>
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
              lastTransaction={`Última entrada dia ${highlightData.entries.lastTransaction}`}
              type="up"
            />

            <HighlightCard 
              title="Saídas" 
              amount={highlightData.expensive.amount}
              lastTransaction={`Última saída dia ${highlightData.expensive.lastTransaction}`}
              type="down"
            />

            <HighlightCard 
              title="Total" 
              amount={highlightData.total.amount} 
              lastTransaction={highlightData.total.lastTransaction}
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
        </>
      )}
    </Container>
  )
};

