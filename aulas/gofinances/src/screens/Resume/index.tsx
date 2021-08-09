import React, { useEffect, useState } from 'react';
import { HistoryCard } from '../../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Container,
  Header,
  Title,
  Content
} from './styles';
import { categories } from '../../utils/categories';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface TotalCategory {
  key: string;
  name: string;
  total: string;
  color: string;
}

export function Resume() {

  const [ totalByCategories, setTotalByCategories ] = useState<TotalCategory[]>([]);

  async function loadData() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted
      .filter((expensive: TransactionData) => expensive.type === 'negative');
    
    const totalByCategory: Array<TotalCategory> = [];

    categories.forEach(category => {
      let categorySum = 0;

      expenses.forEach((expense: TransactionData) => {
        if (expense.category === category.key) {
          categorySum += +expense.amount;
        }
      });

      const total = categorySum.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
      });

      if (categorySum > 0) {
        totalByCategory.push({
          name: category.name,
          color: category.color,
          key: category.key,
          total,
        });
      }

    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      
      <Content>
        {totalByCategories.map(item => (
          <HistoryCard 
            title={item.name}
            amount={item.total}
            color={item.color}
            key={item.key}
          />
        ))}
      </Content>
        
     
    </Container>
  )
}