import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/core';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { VictoryPie } from 'victory-native';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { 
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
} from './styles';

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
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {

  const [ totalByCategories, setTotalByCategories ] = useState<TotalCategory[]>([]);
  const theme = useTheme();

  async function loadData() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted
      .filter((expensive: TransactionData) => expensive.type === 'negative');

    const expensesTotal = expenses.reduce((total: number, expense: TransactionData) => {
      return total + Number(expense.amount);
    }, 0);
    
    const totalByCategory: Array<TotalCategory> = [];

    categories.forEach(category => {
      let categorySum = 0;

      expenses.forEach((expense: TransactionData) => {
        if (expense.category === category.key) {
          categorySum += +expense.amount;
        }
      });

      
      if (categorySum > 0) {

        const totalFormatted = categorySum.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${(categorySum / expensesTotal * 100).toFixed(0)}%`;


        totalByCategory.push({
          name: category.name,
          color: category.color,
          key: category.key,
          totalFormatted,
          total: categorySum,
          percent,
        });
      }

    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [])
  ) 

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      
      <Content>

        <ChartContainer>
          <VictoryPie 
            data={totalByCategories}
            x="percent"
            y="total"
            colorScale={totalByCategories.map(category => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape
              }
            }}
            labelRadius={50}
          />
        </ChartContainer>

        {totalByCategories.map(item => (
          <HistoryCard 
            title={item.name}
            amount={item.totalFormatted}
            color={item.color}
            key={item.key}
          />
        ))}
      </Content>
    </Container>
  )
}